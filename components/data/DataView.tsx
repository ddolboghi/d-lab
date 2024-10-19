"use client";

import { fetchFilteredLogData } from "@/actions/connectData";
import { Condition, DataInfoForConenct } from "@/utils/types";
import { useEffect, useState } from "react";

type DataViewProps = {
  endTime: string;
  dataInfo: DataInfoForConenct;
  conditions: Condition[];
};

export default function DataView({
  endTime,
  dataInfo,
  conditions,
}: DataViewProps) {
  const [data, setData] = useState<any[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFilteredData = async () => {
      setLoading(true);
      const filteredData = await fetchFilteredLogData(
        dataInfo.url,
        dataInfo.apikey,
        dataInfo.metadata,
        conditions
      );
      if (!filteredData) {
        setError("데이터를 불러오는데 실패했습니다.");
      }

      if (filteredData) {
        setError(null);
        setDataKeys(Object.keys(filteredData[0]));
        const lastCreatedAt =
          data && data.length > 0
            ? new Date(data[data.length - 1]["created_at"])
            : null;
        if (lastCreatedAt) {
          const overLastCreatedAtData = filteredData.filter(
            (d) => new Date(d["created_at"]) > lastCreatedAt
          );
          if (overLastCreatedAtData.length > 0) {
            setData([...data, ...overLastCreatedAtData]);
          }
        } else {
          setData(filteredData);
        }
      }
      setLoading(false);
    };

    const endDateTime = new Date(endTime);
    getFilteredData();
    const intervalId = setInterval(() => {
      const currentNow = new Date();
      if (currentNow < endDateTime) {
        getFilteredData();
      } else {
        clearInterval(intervalId);
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            {dataKeys.map((dataKey, idx) => (
              <th key={`data-key-${idx}`} className="border border-black p-2">
                {dataKey}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {dataKeys.map((dataKey, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="border border-black p-2"
                >
                  {JSON.stringify(row[dataKey])}
                </td>
              ))}
            </tr>
          ))}
          {loading && (
            <tr>
              <td>로딩 중...</td>
            </tr>
          )}
          {error && (
            <tr>
              <td className="text-red-400">{error}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="border border-black p-2">
        <h1>집계</h1>
        <p>{data.length}</p>
      </div>
    </div>
  );
}
