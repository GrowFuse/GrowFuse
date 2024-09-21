import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "../ui/button";
import { emailVerifyCodeSchema } from "~/lib/auth/schema"; // You need to define this schema
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  email: string;
}

export default function VerifyCodeForm({ open, setOpen, email }: Props) {
  const form = useForm<z.infer<typeof emailVerifyCodeSchema>>({
    mode: "onChange",
    resolver: zodResolver(emailVerifyCodeSchema),
    defaultValues: { email },
  });

  const { mutate, isPending } = api.auth.verifySignUpCode.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast.success("Email verified successfully!");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const onSubmit = (values: z.infer<typeof emailVerifyCodeSchema>) => {
    mutate(values);
  };

  useEffect(() => {
    if (email.length) form.setValue("email", email);
  }, [email, form]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit verification code sent to your email
            address.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
            <FormField
              control={form.control}
              name="code"
              label="Verification Code"
              render={({ field }) => (
                <InputOTP
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  maxLength={6}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            <DialogFooter>
              <Button loading={isPending} type="submit" className="mt-4 w-full">
                Verify Code
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
