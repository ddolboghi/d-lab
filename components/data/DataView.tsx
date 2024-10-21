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
      const filteredData = await fetchFilteredLogData(
        dataInfo.url,
        dataInfo.headers,
        dataInfo.metadata,
        conditions
      );

      if (filteredData) {
        setError(null);
        setData(filteredData);
      } else {
        setError("데이터를 불러오는데 실패했습니다.");
      }
      setLoading(false);
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
