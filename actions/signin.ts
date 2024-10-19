"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Signin } from "@/utils/types";

export const varifyByEmail = async (
  email: string | undefined | null,
  rawFormData: FormData
) => {
  const password = rawFormData.get("password");
  try {
    if (!email) throw new Error("Not logged in user.");

    const { data, error } = await supabaseClient
      .from("signin")
      .select("password")
      .eq("email", email)
      .single<Signin>();

    if (error) throw error;
    console.log(data, password);
    if (data.password === password) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("[varifyByEmail]", e);
    return false;
  }
};

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
