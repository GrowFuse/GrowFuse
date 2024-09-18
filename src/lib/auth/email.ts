import { hash, type Options, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { type User } from "lucia";
import { isWithinExpirationDate } from "oslo";

import { generateRandomString, alphabet } from "oslo/crypto";
import { db } from "~/server/db";
import { emailVerificationCodeTable } from "~/server/db/schema";

export class EmailAuthService {
  _argon2Options: Options = {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  };
  constructor() {}

  async hash(password: string) {
    return await hash(password, this._argon2Options);
  }

  async verify(passwordHash: string, password: string) {
    return await verify(passwordHash, password, this._argon2Options);
  }

  async generateEmailVerificationCode(userId: string, email: string) {
    await db
      .delete(emailVerificationCodeTable)
      .where(eq(emailVerificationCodeTable.userId, userId));

    const code = generateRandomString(6, alphabet("0-9", "A-Z"));
    await db.insert(emailVerificationCodeTable).values({
      userId,
      email,
      code,
    });

    return code;
  }

  async verifyVerificationCode(user: User, code: string): Promise<boolean> {
    return await db.transaction(
      async (tx) => {
        const [databaseCode] = await tx
          .select()
          .from(emailVerificationCodeTable)
          .where(eq(emailVerificationCodeTable.userId, user.id))
          .limit(1);

        if (!databaseCode || databaseCode.code !== code) {
          return false;
        }

        await tx
          .delete(emailVerificationCodeTable)
          .where(eq(emailVerificationCodeTable.userId, user.id));

        if (
          !isWithinExpirationDate(databaseCode.expiresAt) ||
          databaseCode.email !== user.email
        ) {
          return false;
        }

        return true;
      },
      {
        isolationLevel: "read committed",
        accessMode: "read write",
        deferrable: true,
      },
    );
  }
}
