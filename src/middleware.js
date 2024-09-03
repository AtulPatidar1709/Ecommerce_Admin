import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (token && (url.pathname === "/sign-in" || url.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!token && url.pathname === "/profile") {
    console.log(`Redirecting unauthenticated user to /sign-in`);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// Configuration for the middleware matcher
export const config = {
  matcher: ["/sign-in", "/sign-up", "/profile", "/"], // Match paths for middleware application
};
