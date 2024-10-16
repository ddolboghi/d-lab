"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const googleLogin = async () => {
  const getURL = () => {
    let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.startsWith("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`;
    return url;
  };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${getURL()}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    console.log("error:", error);
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
};
