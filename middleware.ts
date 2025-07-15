import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get("token")?.value;
    const publicRoutes = ["/signin"];
    const isPublic = publicRoutes.includes(request.nextUrl.pathname);

    if (!isLoggedIn && !isPublic) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isLoggedIn && request.nextUrl.pathname === "/signin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api|static).*)"],
};
