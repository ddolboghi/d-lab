"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { Signin } from "@/utils/types";
import { redirect } from "next/navigation";

export const verifyRegisteredUser = async (
  email: string | undefined | null
) => {
  try {
    if (!email) throw new Error("Not logged in user.");

    const { data, error } = await supabaseClient
      .from("signin")
      .select("password")
      .eq("email", email)
      .single<Signin>();

    if (error) throw error;

    if (data) {
      return true;
    }
    return false;
  } catch (e) {
    console.error("[verifyRegisteredUser]", e);
    return false;
  }
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
