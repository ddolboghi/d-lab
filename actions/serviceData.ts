"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { DataInfo, Metadata } from "@/utils/types";
import { revalidateTag } from "next/cache";

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
    revalidateTag("insertDataInfo");
    return true;
  } catch (e) {
    console.error("[insertDataInfo] Error: ", e);
    return false;
  }
};

export const selectDataByServiceId = async (serviceId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/data_info?service_id=eq.${serviceId}&select=id,title,url,apikey,metadata,created_at&order=created_at.asc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        next: {
          tags: ["insertDataInfo", "updateDataInfoById", "deleteDataInfoById"],
        },
      }
    );

    if (!response.ok) throw response.status;

    const data: DataInfo[] = await response.json();
    return data;
  } catch (e) {
    console.error("[selectDataByServiceId] Error: ", e);
    return null;
  }
};

export const updateDataInfoById = async (
  dataInfoId: number,
  title: string,
  url: string,
  apikey: string,
  metadatas: Metadata[]
) => {
  try {
    const { error } = await supabaseClient
      .from("data_info")
      .update({
        title: title,
        url: url,
        apikey: apikey,
        metadata: metadatas,
      })
      .eq("id", dataInfoId);

    if (error) throw error;
    revalidateTag("updateDataInfoById");
    return true;
  } catch (e) {
    console.error("[updateDataInfoById] Error: ", e);
    return false;
  }
};

export const deleteDataInfoById = async (dataInfoId: number) => {
  try {
    const { error } = await supabaseClient
      .from("data_info")
      .delete()
      .eq("id", dataInfoId);

    if (error) throw error;

    revalidateTag("deleteDataInfoById");
    return true;
  } catch (e) {
    console.error("[deleteDataInfoById]", e);
    return false;
  }
};
