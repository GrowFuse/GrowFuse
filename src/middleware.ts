import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ServiceLocator } from "~/lib/service-locator";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const redirectUrl = request.nextUrl.clone();
  const authService = ServiceLocator.getService("AuthService");
  const { session, user } = await authService.validateSession();

  if (
    (pathname.includes("/signin") || pathname.includes("/signup")) &&
    session &&
    user
  ) {
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    !pathname.includes("/signin") &&
    !pathname.includes("/signup") &&
    (!session || !user)
  ) {
    redirectUrl.pathname = "/signin";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api/trpc|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
