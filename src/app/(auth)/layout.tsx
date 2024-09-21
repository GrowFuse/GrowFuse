"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isSignInPage = pathname.includes("signin");
  const isSignUpPage = pathname.includes("signup");
  // const isVerifyCodePage = pathname.includes("verify-signup-code");

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen items-center justify-center py-12">
        <Card className="m-auto grid w-full max-w-[350px] border-none shadow-none">
          <CardHeader>
            <CardTitle>
              {isSignInPage
                ? "Login"
                : isSignUpPage
                  ? "Create Account"
                  : "Verify Your Code"}
            </CardTitle>

            <CardDescription>
              {isSignInPage
                ? "Welcome back! Please enter your email and password to access your account."
                : isSignUpPage
                  ? "Join us! Fill in your details to create a new account and get started."
                  : "We've sent a verification code to your email. Please enter it below."}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-y-4">{children}</CardContent>

          <CardFooter className="justify-center gap-x-1 text-center text-sm">
            {isSignInPage ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/signin" className="underline">
                  Sign in
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
