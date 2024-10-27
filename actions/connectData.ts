"use server";

import { getHeaders } from "@/lib/connectData";
import { filtering, toSet } from "@/lib/dataFilter";
import { Condition, headerPair, Metadata } from "@/utils/types";

export const fetchLogDataByMetadataForFilter = async (
  url: string,
  headerPairs: headerPair[],
  metadata: Metadata
) => {
  const headers = getHeaders(headerPairs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
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

export const fetchFilteredLogData = async (
  url: string,
  headerPairs: headerPair[]
) => {
  const headers = getHeaders(headerPairs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const data: any[] | null = await response.json();
    if (!data) throw new Error("Log data not exist.");

    return data;
  } catch (e) {
    console.error("[fetchFilteredLogData] Error:", e);
    return null;
  }
};

export const fetchLogDataUnderEndTime = async (
  url: string,
  headerPairs: headerPair[]
) => {
  const headers = getHeaders(headerPairs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const data: any[] | null = await response.json();
    if (!data) throw new Error("Log data not exist.");
    return data;
  } catch (e) {
    console.error("[fetchLogDataUnderEndTime] Error:", e);
    return null;
  }
};
