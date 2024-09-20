import "server-only";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { type User } from "lucia";
import { isWithinExpirationDate } from "oslo";

import { generateRandomString, alphabet } from "oslo/crypto";
import { db } from "~/server/db";
import { emailVerificationCodeTable } from "~/server/db/schema";

export class EmailAuthService {
  private _saltRounds = 10;

  constructor() {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this._saltRounds);
  }

  async verify(passwordHash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
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
