import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/meeting",
  "/project",
  "/storage",
  "/",
  /^\/meeting\/[^/]+$/,
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Check for the access token in cookies
  const accessToken = req.cookies.get("accessToken")?.value;

  // Define a function to check if a route matches the pathname
  const isProtectedRoute = (route: string | RegExp) => {
    if (typeof route === "string") {
      return pathname === route;
    }
    if (route instanceof RegExp) {
      return route.test(pathname);
    }
    return false;
  };

  // If the user is trying to access a protected route without being authenticated, redirect to login
  if (!accessToken && protectedRoutes.some(isProtectedRoute)) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and tries to access the login page, redirect to dashboard
  if (accessToken && pathname === "/auth/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/project",
    "/storage",
    "/",
    "/auth/login",
    "/meeting/:id*",
  ],
};
