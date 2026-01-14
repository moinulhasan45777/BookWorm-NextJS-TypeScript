import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("bookworm_token")?.value;
  const { pathname } = req.nextUrl;

  if ((token && pathname === "/register") || (token && pathname === "/")) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
      const baseUrl = req.nextUrl.origin;
      const res = await axios.get(
        `${baseUrl}/api/users/user?email=${decodedToken.email}`
      );

      const redirectUrl =
        res.data.role === "Admin" ? "/admin/overview" : "/reader/my-library";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (!token && pathname !== "/register" && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/reader/:path*", "/register", "/"],
};
