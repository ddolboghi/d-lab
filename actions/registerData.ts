"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Metadata } from "@/utils/types";

export const insertDataInfo = async (
  serviceId: string,
  title: string,
  url: string,
  apikey: string,
  metadatas: Metadata[]
) => {
  try {
    const { error } = await supabaseClient.from("data_info").insert([
      {
        service_id: Number(serviceId),
        title: title,
        url: url,
        apikey: apikey,
        metadata: metadatas,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[insertDataInfo] Error: ", e);
    return false;
  }
};
