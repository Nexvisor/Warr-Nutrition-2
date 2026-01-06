import { NextRequest, NextResponse } from "next/server";

const PRIVATE_BACKEND_ROUTE = [
  "/api/address",
  "/api/cart",
  "/api/getEnv",
  "/api/order",
  "/api/user",
];

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value
  );
}
// wildcard-like match for backend API routes
function isPrivateBackendRoute(pathname: string): boolean {
  return PRIVATE_BACKEND_ROUTE.some((route) => pathname.startsWith(route));
}
export async function middleware(req: NextRequest) {
  const session = getSessionToken(req);
  const currentPath = req.nextUrl.pathname;

  // Not logged in → block protected backend API routes
  if (!session && isPrivateBackendRoute(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (currentPath === "/Protein") {
    return NextResponse.redirect(new URL("/Whey%20Performance", req.url));
  }

  if (currentPath === "/Multi%20Vitamin" || currentPath === "/Multi Vitamin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Protein", "/Multi%20Vitamin", "/Multi Vitamin"],
};
