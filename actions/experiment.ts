"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Condition, Experiment, ExperimentForRead } from "@/utils/types";
import { revalidateTag } from "next/cache";

export const insertExperiment = async (
  serviceId: string,
  formData: FormData,
  experimentalDataConditions: Condition[],
  controlDataConditions: Condition[]
) => {
  let endTime = formData.get("endTime")
    ? new Date(formData.get("endTime") as string).toISOString()
    : null;
  const rawFormData: Experiment = {
    title: formData.get("title") as string,
    overview: formData.get("overview") as string,
    end_time: endTime,
    experimental_data_id: Number(formData.get("experimentalDataId")),
    experimental_data_conditions: experimentalDataConditions,
    control_data_id: Number(formData.get("controlDataId")),
    control_data_conditions: controlDataConditions,
    goal: Number(formData.get("goal")),
  };

  try {
    const { error } = await supabaseClient
      .from("experiment")
      .insert([{ service_id: Number(serviceId), ...rawFormData }]);

    if (error) throw error;
    revalidateTag("insertExperiment");
    return true;
  } catch (e) {
    console.error("[insertExperiment] Error: ", e);
    return false;
  }
};

export const selectExperimentsByServiceId = async (serviceId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/experiment?service_id=eq.${serviceId}&select=*&order=created_at.asc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        next: { tags: ["insertExperiment", "deleteExperimentById"] },
      }
    );

    if (!response.ok) throw response.status;

    const data: ExperimentForRead[] = await response.json();
    return data;
  } catch (e) {
    console.error("[selectExperimentByServiceId] Error: ", e);
    return null;
  }
};

export const selectByServiceIdAndExperimentIdInLogData = async (
  serviceId: string,
  experimentId: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/experiment?service_id=eq.${serviceId}&id=eq.${experimentId}&select=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        next: { tags: ["updateExperimentById", "updateConclusion"] },
      }
    );

    if (!response.ok) throw response.status;

    const result = await response.json();

    const data: ExperimentForRead = result[0];
    return data;
  } catch (e) {
    console.error("[selectByServiceIdAndExperimentIdInLogData]", e);
    return null;
  }
};

export const updateExperimentById = async (
  experimentId: number,
  formData: FormData
) => {
  try {
    const rawFormData = {
      title: formData.get("title"),
      overview: formData.get("overview"),
      goal: formData.get("goal"),
      conclusion: formData.get("conclusion"),
    };

    const { error } = await supabaseClient
      .from("experiment")
      .update(rawFormData)
      .eq("id", experimentId);

    if (error) throw error;
    revalidateTag("updateExperimentById");
    return true;
  } catch (e) {
    console.error("[updateExperimentById]", e);
    return false;
  }
};

export const deleteExperimentById = async (experimentId: number) => {
  try {
    const { error } = await supabaseClient
      .from("experiment")
      .delete()
      .eq("id", experimentId);

    if (error) throw error;

    revalidateTag("deleteExperimentById");
    return true;
  } catch (e) {
    console.error("[deleteExperimentById]", e);
    return false;
  }
};

export const updateConclusion = async (
  experimentId: number,
  actual: number,
  goal: number
) => {
  const conclusion = actual >= goal ? "가설은 참입니다." : "가설은 거짓입니다.";

  try {
    const { data, error } = await supabaseClient
      .from("experiment")
      .update({ conclusion: conclusion })
      .eq("id", experimentId)
      .select("conclusion")
      .single<{ conclusion: string }>();

    if (error) throw error;
    revalidateTag("updateConclusion");
    return data.conclusion;
  } catch (e) {
    console.error("[updateConclusion]", e);
    return null;
  }
};

export const selectConclusionById = async (experimentId: number) => {
  try {
    const { data, error } = await supabaseClient
      .from("experiment")
      .select("conclusion")
      .eq("id", experimentId)
      .single<{ conclusion: string }>();

    if (error) throw error;

    return data.conclusion;
  } catch (e) {
    console.error("[selectConclusionById]", e);
    return null;
  }
};
