import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const protectedRoutes = ["/dashboard"];
  if (protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl));
    }

    if (isLoggedIn && req.auth?.user?.isRegistered === false) {
      return Response.redirect(new URL("/not-register", nextUrl));
    }
  }

  const authRoutes = ["/login"];
  if (authRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }

  const notVerifiedRoutes = ["/not-register"];
  if (notVerifiedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl));
    }
    if (isLoggedIn && req.auth?.user?.isRegistered === true) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
