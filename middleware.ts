import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const adminToken = cookieStore.get("admintoken")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      const userDetails = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verify`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await userDetails.json();
      isAuthenticated = data.success;
    } catch {
      isAuthenticated = false;
    }
  }

  const { pathname } = req.nextUrl;

  if (pathname.includes("admin")) {
    let authenticatedAdmin = false;
   
    if (adminToken) {
      try {
        const verifiedAdmin = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/admin/verify`,
          { method: "GET", headers: { Authorization: `Bearer ${adminToken}` } }
        );
        const adminData = await verifiedAdmin.json();

        authenticatedAdmin = adminData.success;
      } catch (error) {
        authenticatedAdmin = false;
        console.log(error)
      }
    }
   

    if (!authenticatedAdmin && pathname !== "/admin/verify") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/verify";
      return NextResponse.redirect(url);
    }
    if (authenticatedAdmin && pathname === "/admin/verify") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/home";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // If not authenticated and not  on /join, redirect to /join
  if (!isAuthenticated && pathname !== "/join") {
    const url = req.nextUrl.clone();
    url.pathname = "/join";
    return NextResponse.redirect(url);
  }

  // If authenticated and on /join, redirect to /
  if (isAuthenticated && pathname === "/join") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/events", "/join", "/admin/home", "/admin/verify"],
};
