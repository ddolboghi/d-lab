"use client";

import { insertExperiment } from "@/actions/experiment";
import { statisticTypes } from "@/lib/statisticTypes";
import { DataInfo } from "@/utils/types";
import { useState } from "react";
import MetadataTable from "../data/MetadataTable";

type AddExperimentProps = {
  serviceId: string;
  serviceDatas: DataInfo[] | null;
};

export default function ExperimentRegister({
  serviceId,
  serviceDatas,
}: AddExperimentProps) {
  const [showForm, setShowForm] = useState(false);
  const [experimentalData, setExperimentalData] = useState<DataInfo | null>(
    null
  );
  const [controlData, setControlData] = useState<DataInfo | null>(null);
  const [isError, setIsError] = useState(false);

  const handledataChange = (isExperimentData: boolean, value: string) => {
    if (serviceDatas) {
      const selectedData = serviceDatas.filter(
        (data) => data.id === Number(value)
      );
      if (isExperimentData) {
        setExperimentalData(selectedData[0]);
      } else {
        setControlData(selectedData[0]);
      }
    }
  };

  const addExperimet = async (formData: FormData) => {
    if (formData.get("title") && formData.get("endTime")) {
      const response = await insertExperiment(serviceId, formData);
      setIsError(!response);
      if (response) {
        setShowForm(!response);
      }
    } else {
      setIsError(true);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-400 text-white p-2"
      >
        실험 생성하기
      </button>
      {showForm && (
        <form action={addExperimet}>
          <section>
            <label htmlFor="title">실험 제목</label>
            <input
              type="text"
              name="title"
              className="border border-gray-300 rounded p-1 mx-2"
            />
          </section>
          <section>
            <label htmlFor="overview">실험 개요</label>
            <textarea
              name="overview"
              className="border border-gray-300 rounded p-1 mx-2"
            />
          </section>
          <section>
            <label htmlFor="endTime">실험종료 시간</label>
            <input
              type="datetime-local"
              name="endTime"
              className="border border-gray-300 rounded p-1 mx-2"
            />
          </section>
          <label htmlFor="experimentalDataId">실험군</label>
          <select
            name="experimentalDataId"
            value={experimentalData?.id}
            onChange={(e) => handledataChange(true, e.target.value)}
          >
            <option value="">선택 안함</option>
            {serviceDatas &&
              serviceDatas.map((data) => (
                <option
                  key={data.id}
                  value={data.id}
                  disabled={
                    controlData ? Number(controlData.id) === data.id : false
                  }
                >
                  {data.title}
                </option>
              ))}
          </select>
          {experimentalData && (
            <section>
              <label htmlFor="experimentalDataPreProcessingId">
                실험군 전처리 방법
              </label>
              <select name="experimentalDataPreProcessingId">
                <option value="">선택 안함</option>
                {statisticTypes &&
                  statisticTypes.map((type) => (
                    <option
                      key={`experimentalDataPreProcessing-${type.id}`}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
              </select>
              <MetadataTable
                dataInfoId={experimentalData.id}
                metadatas={experimentalData.metadata}
              />
            </section>
          )}
          <label htmlFor="controlDataId">대조군</label>
          <select
            name="controlDataId"
            value={controlData?.id}
            onChange={(e) => handledataChange(false, e.target.value)}
          >
            <option value="">선택 안함</option>
            {serviceDatas &&
              serviceDatas.map((data) => (
                <option
                  key={data.id}
                  value={data.id}
                  disabled={
                    experimentalData
                      ? Number(experimentalData.id) === data.id
                      : false
                  }
                >
                  {data.title}
                </option>
              ))}
          </select>
          {controlData && (
            <section>
              <label htmlFor="controlDataPreProcessingId">
                대조군 전처리 방법
              </label>
              <select name="controlDataPreProcessingId">
                <option value="">선택 안함</option>
                {statisticTypes &&
                  statisticTypes.map((type) => (
                    <option
                      key={`controlDataPreProcessing-${type.id}`}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
              </select>
              <MetadataTable
                dataInfoId={controlData.id}
                metadatas={controlData.metadata}
              />
            </section>
          )}
          <section>
            <label htmlFor="goal">대조군 목표 수치</label>
            <input
              type="number"
              pattern="\d*"
              name="goal"
              className="border border-gray-300 rounded p-1 mx-2"
            />
          </section>
          <button type="submit" className="bg-green-400 text-white p-2">
            실험 시작
          </button>
          {isError && <p>실험 생성 실패</p>}
        </form>
      )}
    </div>
  );
}
