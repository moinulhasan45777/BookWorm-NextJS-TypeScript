import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("bookworm_token")?.value;
  const { pathname } = req.nextUrl;

  if ((token && pathname === "/register") || (token && pathname === "/")) {
    const decodedToken = verifyToken(token);
    if (decodedToken) {
      const redirectUrl =
        decodedToken.role === "Admin"
          ? "/admin/overview"
          : "/reader/my-library";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    return NextResponse.next();
  }

  if (!token && pathname !== "/register" && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("bookworm_token");
      return response;
    }

    if (pathname.startsWith("/admin") && decodedToken.role !== "Admin") {
      return NextResponse.redirect(new URL("/reader/my-library", req.url));
    }

    if (pathname.startsWith("/reader") && decodedToken.role === "Admin") {
      return NextResponse.redirect(new URL("/admin/overview", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/reader/:path*", "/register", "/"],
};
