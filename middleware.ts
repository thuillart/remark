import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = [
  "/logs",
  "/profile",
  "/api-keys",
  "/settings",
  "/contacts",
  "/feedbacks",
];

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname;

  if (sessionCookie) {
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/feedbacks";
      return NextResponse.rewrite(url);
    }

    if (path === "/sign-in") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  const isProtectedPath = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath),
  );

  if (isProtectedPath && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (path === "/home" && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matches everything except api, _next, and static files
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
