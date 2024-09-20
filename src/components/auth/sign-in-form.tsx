"use client";

import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { emailPassSignInSchema } from "~/lib/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { api } from "~/trpc/react";

export default function SignInForm() {
  const form = useForm<z.infer<typeof emailPassSignInSchema>>({
    resolver: zodResolver(emailPassSignInSchema),
  });

  const { mutate, isPending } = api.auth.emailSignIn.useMutation();

  const onSubmit = (values: z.infer<typeof emailPassSignInSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
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

        <Button loading={isPending} type="submit" className="mt-4 w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
