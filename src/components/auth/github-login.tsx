import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function GithubLogin() {
  return (
    <Link
      href="/github/login"
      className={cn(buttonVariants({ variant: "outline" }), "w-full gap-x-2")}
    >
      <GitHubLogoIcon /> Login with GitHub
    </Link>
  );
}
