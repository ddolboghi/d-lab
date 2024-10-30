"use client";

import { fetchLogDataUnderEndTime } from "@/actions/connectData";
import { selectConclusionById, updateConclusion } from "@/actions/experiment";
import { dataFilteringFetch } from "@/lib/dataFilteringFetch";
import { stringToUTC } from "@/lib/dateTranslator";
import {
  Conclusion,
  DataInfoForConenct,
  ExperimentForRead,
} from "@/utils/types";
import { useEffect, useState } from "react";
import ProgressCircle from "../ProgressCircle";
import { LoaderCircle } from "lucide-react";

type ExperimentConclusionProps = {
  experimentalDataInfo: DataInfoForConenct;
  controlDataInfo: DataInfoForConenct;
  experiment: ExperimentForRead;
  endTime: Date | null;
};

export default function ExperimentConclusion({
  experimentalDataInfo,
  controlDataInfo,
  experiment,
  endTime,
}: ExperimentConclusionProps) {
  const [conclusion, setConclusion] = useState<Conclusion | null>(
    experiment.conclusion
  );

  useEffect(() => {
    const calculateConclusion = async () => {
      const savedConclusion = await selectConclusionById(experiment.id);
      if (savedConclusion !== null) {
        setConclusion(savedConclusion);
      } else if (savedConclusion === null && endTime !== null) {
        const experimentData = await fetchLogDataUnderEndTime(
          experimentalDataInfo.url,
          experimentalDataInfo.headers
        );
        const controlData = await fetchLogDataUnderEndTime(
          controlDataInfo.url,
          controlDataInfo.headers
        );

        const experimentFilteredData = await dataFilteringFetch(
          experimentData,
          experimentalDataInfo.metadata,
          experiment.experimental_data_conditions,
          endTime.toString()
        );
        const controlFilteredData = await dataFilteringFetch(
          controlData,
          controlDataInfo.metadata,
          experiment.control_data_conditions,
          endTime.toString()
        );

        const controlValue = controlFilteredData
          ? controlFilteredData.length
          : null;
        const experimentalValue = experimentFilteredData
          ? experimentFilteredData.length
          : null;

        let actual: number | null = null;
        if (endTime) {
          const isEnd = new Date() >= stringToUTC(endTime.toString());
          if (isEnd) {
            if (experimentalValue && controlValue) {
              actual = (experimentalValue / controlValue) * 100;
            }
            const newConclusion: Conclusion = {
              ...conclusion,
              actual: actual,
              result: actual && actual >= experiment.goal ? true : false,
            };
            const updatedConclusion = await updateConclusion(
              experiment.id,
              newConclusion
            );
            if (updatedConclusion) {
              setConclusion(updatedConclusion);
            }
          }
        }
      }
    };

    //conclusion이 존재하지 않거나, 목표 수치를 수정했을때만 호출되야함
    calculateConclusion();
  }, []);

  return (
    <div className="grid grid-cols-3 items-center justify-center text-center px-[90px]">
      <div className="shrink-0 flex flex-row gap-8 items-center justify-center">
        <p className="font-medium">목표 수치</p>
        <ProgressCircle
          percentage={experiment.goal}
          foregroundColor="#979797"
          size={100}
          thickness={12}
          textColor="#525252"
        />
      </div>
      {conclusion && conclusion.actual && (
        <div className="shrink-0 flex flex-row gap-8 items-center justify-center">
          <p className="font-medium">실제 수치</p>
          <ProgressCircle
            percentage={conclusion.actual}
            size={100}
            thickness={12}
            textColor="#525252"
          />
        </div>
      )}
      {conclusion && (
        <div className="shrink-0 flex flex-row gap-8 items-center justify-center">
          <p className="font-medium">결론</p>
          <div className="flex flex-col items-center justify-center w-[100px] h-[100px] rounded-full bg-[#6C6C6C] text-center ">
            <span className="font-extrabold text-[23px] text-white opacity-80">
              {conclusion.result ? "참" : "거짓"}
            </span>
            <span className="text-[13px] text-white opacity-80">
              {conclusion.result ? "True" : "False"}
            </span>
          </div>
        </div>
      )}
      {!conclusion && (
        <div className="flex flex-row items-center justify-center gap-1">
          <p>실험 진행 중</p>
          <LoaderCircle className="animate-spin h-[20px]" />
        </div>
      )}
    </div>
  );
}
