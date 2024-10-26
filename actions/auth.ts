"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Signin } from "@/utils/types";

export const verifyRegisteredMember = async (
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
    console.error("[verifyRegisteredMember]", e);
    return false;
  }
};
