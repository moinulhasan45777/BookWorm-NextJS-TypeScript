import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("bookworm_token")?.value;
  const { pathname } = req.nextUrl;

  if ((token && pathname === "/register") || (token && pathname === "/")) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
      };
      const redirectUrl =
        decodedToken.role === "Admin" ? "/admin/overview" : "/reader/home";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (!token && pathname !== "/register" && pathname !== "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/reader/:path*", "/register", "/"],
};
