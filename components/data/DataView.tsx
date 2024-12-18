"use client";

import { fetchFilteredLogData } from "@/actions/connectData";
import { dataFilteringFetch } from "@/lib/dataFilteringFetch";
import { stringToUTC } from "@/lib/dateTranslator";
import { Condition, DataInfoForConenct } from "@/utils/types";
import { useEffect, useState } from "react";
import ConditionView from "../experiment/ConditionView";
import { LoaderCircle } from "lucide-react";

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
      const createdAtColumn = dataInfo.metadata.find(
        (md) => md.description === "created_at"
      );
      if (!createdAtColumn) throw new Error("Column 'created_at' not exist.");

      const rawData = await fetchFilteredLogData(
        dataInfo.url,
        dataInfo.headers
      );

      const filteredData = await dataFilteringFetch(
        rawData,
        dataInfo.metadata,
        conditions,
        endTime
      );

      if (!filteredData) {
        setError("데이터를 불러오는데 실패했습니다.");
      } else {
        setError(null);
        setData(filteredData);
      }
      setLoading(false);
    };

    getFilteredData();
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
    <div>
      <div className="absolute flex flex-row items-center gap-2 -translate-y-[22px] translate-x-[110px]">
        {loading && <LoaderCircle className="animate-spin w-4" />}
        {error && <p className="text-red-400">{error}</p>}
      </div>
      <table className="text-center w-full">
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
                <div
                  key={`condition-${idx}`}
                  className="flex flex-row text-[14px]"
                >
                  <ConditionView condition={condition} />
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
