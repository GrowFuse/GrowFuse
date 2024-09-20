import "server-only";

import {
  emailPassSignInSchema,
  emailPassSignUpSchema,
  emailVerifyCodeSchema,
} from "~/lib/auth/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userTable } from "~/server/db/schema";
import { ServiceLocator } from "~/lib/service-locator";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  emailSignUp: publicProcedure
    .input(emailPassSignUpSchema)
    .mutation(
      async ({
        input: { firstName, lastName, email, password },
        ctx: { db },
      }) => {
        const authService = ServiceLocator.getService("AuthService");
        const emailAuthService = ServiceLocator.getService("EmailAuthService");

        try {
          const passwordHash = await emailAuthService.hash(password);
          const [user] = await db
            .insert(userTable)
            .values({
              name: firstName + " " + lastName,
              email,
              passwordHash,
            })
            .returning({ id: userTable.id });

          const code = await emailAuthService.generateEmailVerificationCode(
            user!.id,
            email,
          );

          console.log(code);
          // TODO: send code, to user email

          const session = await authService.createSession(user!.id);
          authService.createSessionCookie(session.id);
          return;
        } catch {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already used",
          });
        }
      },
    ),

  emailSignIn: publicProcedure
    .input(emailPassSignInSchema)
    .mutation(async ({ input: { email, password }, ctx: { db } }) => {
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (!user || !user.passwordHash)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already used",
        });

      const authService = ServiceLocator.getService("AuthService");
      const emailAuthService = ServiceLocator.getService("EmailAuthService");

      const validPassword = await emailAuthService.verify(
        user.passwordHash,
        password,
      );

      if (!validPassword)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already used",
        });

      const session = await authService.createSession(user.id);
      authService.createSessionCookie(session.id);
      return;
    }),

  verifySignUpCode: protectedProcedure
    .input(emailVerifyCodeSchema)
    .mutation(async ({ ctx: { db, user }, input: { code } }) => {
      const authService = ServiceLocator.getService("AuthService");
      const emailAuthService = ServiceLocator.getService("EmailAuthService");

      const validCode = await emailAuthService.verifyVerificationCode(
        user,
        code,
      );

      if (!validCode)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      await authService.invalidateUserSessions(user.id);
      await db
        .update(userTable)
        .set({ emailVerified: true })
        .where(eq(userTable.id, user.id));

      const session = await authService.createSession(user.id);
      authService.createSessionCookie(session.id);
      return;
    }),
});
