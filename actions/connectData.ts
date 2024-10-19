"use server";

import { filtering, toSet } from "@/lib/dataFilter";
import { Condition, headerPair, Metadata } from "@/utils/types";

export const fetchLogDataByMetadataForFilter = async (
  url: string,
  headerPairs: headerPair[],
  metadata: Metadata
) => {
  const headers = headerPairs.reduce(
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {} as Record<string, string>
  );

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
  apikey: string,
  metadatas: Metadata[],
  conditions: Condition[]
) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: apikey,
      },
    });

    const data: any[] | null = await response.json();
    if (!data) throw new Error("Log data not exist.");

    const filteredData = filtering(data, metadatas, conditions);
    const sortedData = filteredData.sort((a, b) => {
      return (
        new Date(a["created_at"]).getTime() -
        new Date(b["created_at"]).getTime()
      );
    });
    return sortedData;
  } catch (e) {
    console.error("[fetchFilteredLogData] Error:", e);
    return null;
  }
};
