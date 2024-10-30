import { Condition, Metadata } from "@/utils/types";
import { endTimeFilter } from "./dataFilter";

export const dataFilteringFetch = async (
  rawData: any[] | null,
  metadatas: Metadata[],
  conditions: Condition[],
  endTimeString: string | null
) => {
  try {
    if (rawData === null) throw new Error("rawData is null.");

    const metadataFilterResponse = await fetch("/api/metadata-filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: rawData,
        metadatas: metadatas,
      }),
    });

    if (!metadataFilterResponse.ok)
      throw new Error(metadataFilterResponse.status.toString());

    const metadataFilterJson = await metadataFilterResponse.json();
    let filteredData: any[] = metadataFilterJson.filteredData;

    if (filteredData) {
      for (const condition of conditions) {
        const stringFilterResponse = await fetch("/api/string-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: filteredData,
            condition: condition,
          }),
        });

        if (!stringFilterResponse.ok)
          throw new Error(stringFilterResponse.status.toString());

        const stringFilterJson = await stringFilterResponse.json();
        filteredData = stringFilterJson.filteredData;

        const numberFilterResponse = await fetch("/api/number-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: filteredData,
            condition: condition,
          }),
        });

        if (!numberFilterResponse.ok)
          throw new Error(numberFilterResponse.status.toString());

        const numberFilterJson = await numberFilterResponse.json();
        filteredData = numberFilterJson.filteredData;

        const booleanFilterResponse = await fetch("/api/boolean-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: filteredData,
            condition: condition,
          }),
        });

        if (!booleanFilterResponse.ok)
          throw new Error(booleanFilterResponse.status.toString());

        const booleanFilterJson = await booleanFilterResponse.json();
        filteredData = booleanFilterJson.filteredData;

        const createdAtFilterResponse = await fetch("/api/created-at-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: filteredData,
            condition: condition,
          }),
        });

        if (!createdAtFilterResponse.ok)
          throw new Error(createdAtFilterResponse.status.toString());

        const createdAtFilterJson = await createdAtFilterResponse.json();
        filteredData = createdAtFilterJson.filteredData;
      }
    }
    const sortedData = filteredData.sort((a, b) => {
      return (
        new Date(a["created_at"]).getTime() -
        new Date(b["created_at"]).getTime()
      );
    });

    if (endTimeString !== null) {
      return endTimeFilter(sortedData, endTimeString);
    }

    return sortedData;
  } catch (e) {
    return null;
  }
};
