"use client";

import { fetchFilteredLogData } from "@/actions/connectData";
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
  const [rawfetchCycle, setRawFetchCycle] = useState<number>(10);
  const [fetchCycle, setFetchCycle] = useState<number>(10);

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

    if (fetchCycle >= 5) {
      const intervalId = setInterval(() => {
        const currentNow = new Date();
        if (endTime) {
          const endDateTime = new Date(endTime);
          if (currentNow < endDateTime) {
            getFilteredData();
          } else {
            clearInterval(intervalId);
          }
        } else {
          getFilteredData();
        }
      }, fetchCycle * 1000);
      return () => clearInterval(intervalId);
    }
  }, [fetchCycle]);

  const handleRawFetchCycle = (value: string) => {
    if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
      setRawFetchCycle(Number(value));
      setError(null);
    } else {
      setError("잘못된 값입니다. 최소 5초 주기로 데이터를 불러올 수 있습니다.");
    }
  };

  const handleCycleBtn = () => {
    setFetchCycle(rawfetchCycle);
  };

  return (
    <div className="flex flex-col">
      <div>
        <label>새로고침 주기(초)</label>
        <input
          type="text"
          value={rawfetchCycle}
          className="border border-black rounded px-1"
          onChange={(e) => handleRawFetchCycle(e.target.value)}
        />
        <button
          onClick={handleCycleBtn}
          className="rounded bg-blue-400 text-white px-1"
        >
          적용
        </button>
      </div>
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
