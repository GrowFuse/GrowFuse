import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <Card className="m-auto grid w-full max-w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle className=".h1">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>

          <div className="flex items-center justify-between gap-x-2">
            <Separator className="w-[45%]" />
            <p className="text-muted-foreground">or</p>
            <Separator className="w-[45%]" />
          </div>

          <Button variant="outline" type="button" className="w-full gap-x-2">
            <GitHubLogoIcon /> Login with GitHub
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
