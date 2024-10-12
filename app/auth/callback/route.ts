import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const protocol = request.headers.get("x-forwarded-proto");
      const isLocalEnv = process.env.NODE_ENV === "development";
      return redirect(next);

      // if (forwardedHost) {
      //   // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      //   return NextResponse.redirect(`https://${forwardedHost}${next}`);
      // } else {
      //   return NextResponse.redirect(`${origin}${next}`);
      // }
    }
  }

  return redirect("/error");
}
