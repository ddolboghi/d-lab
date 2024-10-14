"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { ServiceWithId } from "@/utils/types";
import { revalidateTag } from "next/cache";

export const insertService = async (addServiceFormData: FormData) => {
  try {
    const { error } = await supabaseClient.from("service").insert([
      {
        name: addServiceFormData.get("name"),
      },
    ]);

    if (error) throw error;
    revalidateTag("insertService");
    return true;
  } catch (e) {
    console.error("[insertService] Error: ", e);
    return false;
  }
};

export const selectAllService = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/service?select=id,name&order=created_at.asc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        next: { tags: ["insertService"] },
      }
    );

    if (!response.ok) throw response.status;

    const data: ServiceWithId[] = await response.json();
    return data;
  } catch (e) {
    console.error("[selectAllService] Error: ", e);
    return null;
  }
};
