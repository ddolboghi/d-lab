"use client";

import { insertExperiment } from "@/actions/experiment";
import {
  BooleanCondition,
  Condition,
  CreatedAtCondition,
  DataInfo,
  NumberEqualCondition,
  NumberRangeCondition,
  StringArrayCondition,
  StringIncludedCondition,
} from "@/utils/types";
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
  const [experimentalDataInfo, setExperimentalDataInfo] =
    useState<DataInfo | null>(null);
  const [experimentalDataConditions, setExperimentalDataConditions] = useState<
    Condition[]
  >([]);
  const [controlDataInfo, setControlDataInfo] = useState<DataInfo | null>(null);
  const [controlDataConditions, setControlDataConditions] = useState<
    Condition[]
  >([]);
  const [isError, setIsError] = useState(false);

  const handledataChange = (isExperimentData: boolean, value: string) => {
    if (serviceDatas) {
      const selectedData = serviceDatas.filter(
        (data) => data.id === Number(value)
      );
      if (isExperimentData) {
        setExperimentalDataInfo(selectedData[0]);
      } else {
        setControlDataInfo(selectedData[0]);
      }
    }
  };

  const handleCondition = (isControl: boolean, condition: Condition) => {
    if (
      [
        "includedString",
        "notIncludedString",
        "selectedStrings",
        "notSelectedStrings",
      ].includes(condition.conditionType)
    ) {
      handleStringCondition(
        isControl,
        condition as StringIncludedCondition | StringArrayCondition
      );
    } else if (
      ["equalConditionValue", "rangeConditionValue"].includes(
        condition.conditionType
      )
    ) {
      handleNumberCondition(
        isControl,
        condition as NumberEqualCondition | NumberRangeCondition
      );
    } else if ("booleanConditionValue" === condition.conditionType) {
      handleBooleanCondition(isControl, condition);
    } else if ("createdAtConditionValue" === condition.conditionType) {
      handleCreatedAtCondition(isControl, condition);
    } else {
      throw new Error("Not existed Condition.");
    }
  };

  const handleStringCondition = (
    isControl: boolean,
    stringCondition: StringIncludedCondition | StringArrayCondition
  ) => {
    const columnName = stringCondition.columnName;
    // 모든 문자열 조건 값은 null이 될 수 있음
    if (stringCondition.conditionValue === null) {
      deleteDataCondition(isControl, columnName);
      return;
    }
    pushDataCondition(isControl, stringCondition);
  };

  const handleNumberCondition = (
    isControl: boolean,
    numberCondition: NumberEqualCondition | NumberRangeCondition
  ) => {
    const columnName = numberCondition.columnName;
    if (numberCondition.conditionType === "equalConditionValue") {
      if (numberCondition.conditionValue === null) {
        deleteDataCondition(isControl, columnName);
        return;
      }
    } else if (numberCondition.conditionType === "rangeConditionValue") {
      if (
        numberCondition.conditionValue.over === null &&
        numberCondition.conditionValue.under === null
      ) {
        deleteDataCondition(isControl, columnName);
        return;
      }
    }
    pushDataCondition(isControl, numberCondition);
  };

  const handleBooleanCondition = (
    isControl: boolean,
    booleanCondition: BooleanCondition
  ) => {
    if (booleanCondition.conditionValue === null) {
      deleteDataCondition(isControl, booleanCondition.columnName);
      return;
    }
    pushDataCondition(isControl, booleanCondition);
  };

  const handleCreatedAtCondition = (
    isControl: boolean,
    createdAtConditionValue: CreatedAtCondition
  ) => {
    if (
      createdAtConditionValue.conditionValue.over === null &&
      createdAtConditionValue.conditionValue.under === null
    ) {
      deleteDataCondition(isControl, createdAtConditionValue.columnName);
      return;
    }
    pushDataCondition(isControl, createdAtConditionValue);
  };

  const deleteDataCondition = (isControl: boolean, columnName: string) => {
    if (isControl) {
      const newDataConditions = controlDataConditions.filter(
        (cond) => cond.columnName !== columnName
      );
      setControlDataConditions(newDataConditions);
    } else {
      const newDataConditions = experimentalDataConditions.filter(
        (cond) => cond.columnName !== columnName
      );
      setExperimentalDataConditions(newDataConditions);
    }
  };

  const pushDataCondition = (isControl: boolean, condition: Condition) => {
    const columnName = condition.columnName;
    if (isControl) {
      const isExistedInControl = controlDataConditions.some(
        (cond) => cond.columnName === columnName
      );
      if (isExistedInControl) {
        const newDataConditions = controlDataConditions.map((cond) =>
          cond.columnName === columnName ? condition : cond
        );
        setControlDataConditions(newDataConditions);
      } else {
        setControlDataConditions([...controlDataConditions, condition]);
      }
    } else {
      const isExistedInExperimental = experimentalDataConditions.some(
        (cond) => cond.columnName === columnName
      );
      if (isExistedInExperimental) {
        const newDataConditions = experimentalDataConditions.map((cond) =>
          cond.columnName === columnName ? condition : cond
        );
        setExperimentalDataConditions(newDataConditions);
      } else {
        setExperimentalDataConditions([
          ...experimentalDataConditions,
          condition,
        ]);
      }
    }
  };

  const addExperimet = async (formData: FormData) => {
    if (formData.get("title")) {
      const response = await insertExperiment(
        serviceId,
        formData,
        experimentalDataConditions,
        controlDataConditions
      );
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
              required
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
            value={experimentalDataInfo?.id}
            onChange={(e) => handledataChange(true, e.target.value)}
          >
            <option value="">선택 안함</option>
            {serviceDatas &&
              serviceDatas.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.title}
                </option>
              ))}
          </select>
          {experimentalDataInfo && (
            <MetadataTable
              dataInfo={experimentalDataInfo}
              handleCondition={handleCondition}
            />
          )}
          <label htmlFor="controlDataId">대조군</label>
          <select
            name="controlDataId"
            value={controlDataInfo?.id}
            onChange={(e) => handledataChange(false, e.target.value)}
          >
            <option value="">선택 안함</option>
            {serviceDatas &&
              serviceDatas.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.title}
                </option>
              ))}
          </select>
          {controlDataInfo && (
            <MetadataTable
              dataInfo={controlDataInfo}
              isControl={true}
              handleCondition={handleCondition}
            />
          )}
          <section>
            <label htmlFor="goal">실험군 목표 수치</label>
            <input
              type="number"
              pattern="\d*"
              name="goal"
              className="border border-gray-300 rounded p-1 mx-2"
            />
            <span>%</span>
          </section>
          <button type="submit" className="bg-green-400 text-white p-2">
            실험 시작
          </button>
          {isError && <p className="text-red-400">실험 생성 실패</p>}
        </form>
      )}
    </div>
  );
}
