"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Condition, Experiment, ExperimentForRead } from "@/utils/types";
import { revalidateTag } from "next/cache";
import schedule from "node-schedule";

export const startExperiment = async (
  serviceId: string,
  formData: FormData,
  experimentalDataConditions: Condition[],
  controlDataConditions: Condition[]
) => {
  const rawFormData: Experiment = {
    title: formData.get("title") as string,
    overview: formData.get("overview") as string,
    end_time: new Date(formData.get("endTime") as string).toISOString(),
    experimental_data_id: Number(formData.get("experimentalDataId")),
    experimental_data_conditions: experimentalDataConditions,
    control_data_id: Number(formData.get("controlDataId")),
    control_data_conditions: controlDataConditions,
    goal: Number(formData.get("goal")),
  };

  const insertResponse = await insertExperiment(serviceId, rawFormData);
  if (!insertResponse) return false;

  schedule.scheduleJob(rawFormData.end_time, function () {
    //최신 데이터 받아서 conclusion 계산하고 update
    console.log("Scheduler ended at endTime");
  });

  return true;
};

export const insertExperiment = async (
  serviceId: string,
  rawFormData: Experiment
) => {
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
    const { data, error } = await supabaseClient
      .from("experiment")
      .select("*")
      .eq("id", experimentId)
      .eq("service_id", serviceId)
      .single<ExperimentForRead>();

    if (error) throw error;
    if (!data) throw new Error("Experiment not existed.");
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
