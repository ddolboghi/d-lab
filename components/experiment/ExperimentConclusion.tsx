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
          experiment.experimental_data_conditions
        );
        const controlFilteredData = await dataFilteringFetch(
          controlData,
          controlDataInfo.metadata,
          experiment.control_data_conditions
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

    if (!experiment.conclusion) {
      calculateConclusion();
    }
  }, []);

  return (
    <div>
      <p>목표 수치: {experiment.goal}%</p>
      {conclusion ? (
        <div>
          {conclusion.actual && <p>실제 수치: {conclusion.actual}%</p>}
          <p>{conclusion?.result ? "참" : "거짓"}</p>
        </div>
      ) : (
        <p>실험 진행 중...</p>
      )}
    </div>
  );
}
