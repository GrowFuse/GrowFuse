"use client";

import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { emailPassSignUpSchema } from "~/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useState } from "react";
import VerifyCodeForm from "./verify-code-form";
import Link from "next/link";

export default function SignUpForm() {
  const form = useForm<z.infer<typeof emailPassSignUpSchema>>({
    resolver: zodResolver(emailPassSignUpSchema),
  });

  const [open, setOpen] = useState(false);

  const { mutate, isPending } = api.auth.emailSignUp.useMutation({
    onSuccess: () => {
      setOpen(true);
      toast.success(
        "Account created successfully! Please check your email for verification.",
      );
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const onSubmit = (values: z.infer<typeof emailPassSignUpSchema>) => {
    return mutate(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              label="First Name"
              render={({ field }) => <Input {...field} />}
            />

            <FormField
              control={form.control}
              name="lastName"
              label="Last Name"
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            label="Email"
            render={({ field }) => <Input {...field} />}
          />

          <FormField
            control={form.control}
            name="password"
            label="Passowrd"
            render={({ field }) => <PasswordInput {...field} />}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            label="Confirm Passowrd"
            render={({ field }) => <PasswordInput {...field} />}
          />

          <Button loading={isPending} type="submit" className="mt-4 w-full">
            Sign Up
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </form>
      </Form>

      <VerifyCodeForm
        email={form.getValues("email")}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
