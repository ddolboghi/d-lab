"use client";

import { fetchFilteredLogData } from "@/actions/connectData";
import { stringToUTC } from "@/lib/dateTranslator";
import { Condition, DataInfoForConenct } from "@/utils/types";
import { useEffect, useState } from "react";

type DataViewProps = {
  endTime: string | null;
  dataInfo: DataInfoForConenct;
  conditions: Condition[];
};

function isDefinedArray(data: any[] | undefined): data is any[] {
  return data !== undefined;
}

export default function DataView({
  endTime,
  dataInfo,
  conditions,
}: DataViewProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFilteredData = async () => {
      setLoading(true);
      try {
        const createdAtColumn = dataInfo.metadata.find(
          (md) => md.description === "created_at"
        );
        if (!createdAtColumn) throw new Error("Column 'created_at' not exist.");

        const rawData = await fetchFilteredLogData(
          dataInfo.url,
          dataInfo.headers
        );
        if (!rawData) throw new Error("Raw data not exist.");

        const host =
          process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.NEXT_PUBLIC_VERCEL_URL;

        const metadataFilterResponse = await fetch(
          `${host}/api/metadata-filter`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: rawData,
              metadatas: dataInfo.metadata,
            }),
          }
        );

        if (!metadataFilterResponse.ok)
          throw new Error(metadataFilterResponse.status.toString());

        const metadataFilterJson = await metadataFilterResponse.json();
        let filteredData: any[] = metadataFilterJson.filteredData;

        if (isDefinedArray(filteredData)) {
          for (const condition of conditions) {
            const stringFilterResponse = await fetch(
              `${host}/api/string-filter`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: filteredData,
                  condition: condition,
                }),
              }
            );

            if (!stringFilterResponse.ok)
              throw new Error(stringFilterResponse.status.toString());

            const stringFilterJson = await stringFilterResponse.json();
            filteredData = stringFilterJson.filteredData;

            const numberFilterResponse = await fetch(
              `${host}/api/number-filter`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: filteredData,
                  condition: condition,
                }),
              }
            );

            if (!numberFilterResponse.ok)
              throw new Error(numberFilterResponse.status.toString());

            const numberFilterJson = await numberFilterResponse.json();
            filteredData = numberFilterJson.filteredData;

            const booleanFilterResponse = await fetch(
              `${host}/api/boolean-filter`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: filteredData,
                  condition: condition,
                }),
              }
            );

            if (!booleanFilterResponse.ok)
              throw new Error(booleanFilterResponse.status.toString());

            const booleanFilterJson = await booleanFilterResponse.json();
            filteredData = booleanFilterJson.filteredData;

            const createdAtFilterResponse = await fetch(
              `${host}/api/created-at-filter`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: filteredData,
                  condition: condition,
                }),
              }
            );

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
        setError(null);
        setData(sortedData);
      } catch (e) {
        setError("데이터를 불러오는데 실패했습니다.");
        return;
      } finally {
        setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      const currentNow = new Date();
      if (endTime) {
        if (currentNow < stringToUTC(endTime)) {
          getFilteredData();
        } else {
          clearInterval(intervalId);
        }
      } else {
        getFilteredData();
      }
    }, 10 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col">
      {loading && <span>로딩 중...</span>}
      {error && <p className="text-red-400">{error}</p>}
      <table className="text-center">
        <thead>
          <tr>
            <th className="border border-black p-2 w-1/4">필터링 조건</th>
            <th className="border border-black p-2 w-1/4">집계</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2 w-1/4">
              {conditions.map((condition, idx) => (
                <div key={`condition-${idx}`} className="flex flex-row">
                  <p>{condition.columnName}</p>
                  <p>{JSON.stringify(condition.conditionValue)}</p>
                </div>
              ))}
            </td>
            <td className="border border-black p-2 w-1/4">{data.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
