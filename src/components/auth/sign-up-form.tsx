"use client";

import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { emailPassSignUpSchema } from "~/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";

export default function SignUpForm() {
  const form = useForm<z.infer<typeof emailPassSignUpSchema>>({
    resolver: zodResolver(emailPassSignUpSchema),
  });

  const onSubmit = (_: z.infer<typeof emailPassSignUpSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
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

        <Button type="submit" className="mt-4 w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
