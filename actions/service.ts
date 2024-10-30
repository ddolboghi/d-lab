"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { ServiceWithId } from "@/utils/types";
import { revalidateTag } from "next/cache";

export const insertService = async (rawFormData: FormData) => {
  try {
    const inputName = rawFormData.get("name") as string;
    if (inputName.length < 1) {
      rawFormData.set("name", "제목 없음");
    }
    const { error } = await supabaseClient.from("service").insert([
      {
        name: rawFormData.get("name"),
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
        next: {
          tags: ["insertService", "updateServiceById", "deleteServiceById"],
        },
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

export const selectServiceById = async (serviceId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/service?select=id,name,created_at&id=eq.${serviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        next: { tags: ["updateServiceById"] },
      }
    );

    if (!response.ok) throw response.status;

    const data: ServiceWithId[] = await response.json();

    if (data.length > 1) throw new Error("More than one service row exists.");

    return data[0];
  } catch (e) {
    console.error("[selectServiceById] Error: ", e);
    return null;
  }
};

export const updateServiceById = async (
  serviceId: number,
  formData: FormData
) => {
  try {
    const inputName = formData.get("name") as string;
    if (inputName.length < 1) {
      formData.set("name", "제목 없음");
    }

    const rawFormData = {
      name: formData.get("name"),
    };

    const { error } = await supabaseClient
      .from("service")
      .update(rawFormData)
      .eq("id", serviceId);

    if (error) throw error;

    revalidateTag("updateServiceById");
    return true;
  } catch (e) {
    console.error("[updateServiceById]", e);
    return false;
  }
};

export const deleteServiceById = async (serviceId: number) => {
  try {
    const { error } = await supabaseClient
      .from("service")
      .delete()
      .eq("id", serviceId);

    if (error) throw error;

    revalidateTag("deleteServiceById");
    return true;
  } catch (e) {
    console.error("[deleteServiceById]", e);
    return false;
  }
};
