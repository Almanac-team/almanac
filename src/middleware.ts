import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  //   const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token && pathname != "/login") {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
    matcher: [
      '/((?!_next|api/auth).*)(.+)'
    ],
}