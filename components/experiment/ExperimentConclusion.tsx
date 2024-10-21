"use client";

import { fetchFilteredLogData } from "@/actions/connectData";
import { selectConclusionById, updateConclusion } from "@/actions/experiment";
import { DataInfoForConenct, ExperimentForRead } from "@/utils/types";
import { useEffect, useState } from "react";

type ExperimentConclusionProps = {
  experimentalDataInfo: DataInfoForConenct;
  controlDataInfo: DataInfoForConenct;
  experiment: ExperimentForRead;
};

export default function ExperimentConclusion({
  experimentalDataInfo,
  controlDataInfo,
  experiment,
}: ExperimentConclusionProps) {
  const [conclusion, setConclusion] = useState("");
  const [actual, setActual] = useState<number | null>(null);

  useEffect(() => {
    const calculateConclusion = async () => {
      const savedConclusion = await selectConclusionById(experiment.id);
      if (savedConclusion !== null) {
        setConclusion(savedConclusion);
        return;
      }

      const experimentFilteredData = await fetchFilteredLogData(
        experimentalDataInfo.url,
        experimentalDataInfo.headers,
        experimentalDataInfo.metadata,
        experiment.experimental_data_conditions
      );
      const controlFilteredData = await fetchFilteredLogData(
        controlDataInfo.url,
        controlDataInfo.headers,
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
      if (experiment.end_time) {
        const isEnd = new Date() >= new Date(experiment.end_time);
        console.log("isEnd:", isEnd);
        console.log(new Date(), new Date(experiment.end_time));
        if (isEnd) {
          if (experimentalValue && controlValue) {
            actual = (experimentalValue / controlValue) * 100;
            setActual(actual);
          }
          if (actual) {
            const updatedConclusion = await updateConclusion(
              experiment.id,
              actual,
              experiment.goal
            );
            if (updatedConclusion) {
              setConclusion(updatedConclusion);
            }
          }
        }
      }
    };
    calculateConclusion();
  }, []);

  return (
    <div>
      <p>목표 수치: {experiment.goal}%</p>
      {actual && <p>실제 수치: {actual}%</p>}
      <p>{conclusion}</p>
    </div>
  );
}
