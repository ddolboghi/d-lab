"use server";

import { toSet } from "@/lib/dataFilter";
import { Metadata } from "@/utils/types";

export const fetchDataByMetadata = async (
  url: string,
  apikey: string,
  metadata: Metadata
) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: apikey,
      },
    });

    const rawData: any[] = await response.json();
    const data = toSet(rawData.map((d) => d[metadata.columnName]));
    return Array.from(data);
  } catch (e) {
    console.error("[fetchData] Error:", e);
    return null;
  }
};

export const fetchData = async (
  url: string,
  apikey: string,
  endTime: string
) => {
  if (new Date() >= new Date(endTime))
    throw new Error("Already past end time.");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: apikey,
      },
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("[fetchData] Error:", e);
    return null;
  }
};
