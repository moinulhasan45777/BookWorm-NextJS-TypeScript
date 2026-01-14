import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("bookworm_token")?.value || null;
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function authenticateRequest(req: NextRequest): {
  authenticated: boolean;
  user: DecodedToken | null;
} {
  const token = getTokenFromRequest(req);
  if (!token) {
    return { authenticated: false, user: null };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { authenticated: false, user: null };
  }

  return { authenticated: true, user: decoded };
}

export function requireAuth(req: NextRequest): {
  success: boolean;
  user?: DecodedToken;
  response?: NextResponse;
} {
  const { authenticated, user } = authenticateRequest(req);

  if (!authenticated || !user) {
    return {
      success: false,
      response: unauthorizedResponse("Authentication required"),
    };
  }

  return { success: true, user };
}

export function requireAdmin(req: NextRequest): {
  success: boolean;
  user?: DecodedToken;
  response?: NextResponse;
} {
  const authResult = requireAuth(req);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user?.role !== "Admin") {
    return {
      success: false,
      response: forbiddenResponse("Admin access required"),
    };
  }

  return { success: true, user: authResult.user };
}
