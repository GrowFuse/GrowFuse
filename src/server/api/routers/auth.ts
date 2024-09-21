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
import { and, eq } from "drizzle-orm";

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

          await db
            .delete(userTable)
            .where(
              and(
                eq(userTable.emailVerified, false),
                eq(userTable.email, email),
              ),
            );

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
        } catch (error) {
          console.log(error);
          if (
            error instanceof Error &&
            error.message.includes("unique constraint")
          )
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "This email address is already registered. Please use a different email or try signing in.",
            });

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "An unexpected error occurred during sign up. Please try again later.",
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
          code: "NOT_FOUND",
          message:
            "No account found with this email address. Please check your email or sign up for a new account.",
        });

      const authService = ServiceLocator.getService("AuthService");
      const emailAuthService = ServiceLocator.getService("EmailAuthService");

      const validPassword = await emailAuthService.verify(
        user.passwordHash,
        password,
      );

      if (!validPassword)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Incorrect password. Please try again or use the 'Forgot Password' option.",
        });

      const session = await authService.createSession(user.id);
      authService.createSessionCookie(session.id);
      return;
    }),

  verifySignUpCode: publicProcedure
    .input(emailVerifyCodeSchema)
    .mutation(async ({ ctx: { db }, input: { code, email } }) => {
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (!user || !user.passwordHash)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No account found with this email address. Please check your email or sign up for a new account.",
        });

      const authService = ServiceLocator.getService("AuthService");
      const emailAuthService = ServiceLocator.getService("EmailAuthService");

      const validCode = await emailAuthService.verifyVerificationCode(
        user,
        code,
      );

      if (!validCode)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid or expired verification code. Please request a new code and try again.",
        });

      await Promise.all([
        authService.invalidateUserSessions(user.id),
        db
          .update(userTable)
          .set({ emailVerified: true })
          .where(eq(userTable.id, user.id)),
      ]);

      const session = await authService.createSession(user.id);
      authService.createSessionCookie(session.id);
      return;
    }),
});
