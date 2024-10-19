"use client";

import { insertExperiment } from "@/actions/experiment";
import {
  Condition,
  ConditionType,
  ConditionValue,
  CreatedAtCondition,
  DataInfo,
  RangeCondition,
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

  const handleNumberConditions = (
    isControl: boolean,
    columnName: string,
    equalConditionValue: number | null,
    rangeCondition: RangeCondition
  ) => {
    if (
      equalConditionValue === null &&
      rangeCondition.overConditionValue === null &&
      rangeCondition.underConditionValue === null
    ) {
      deleteDataCondition(isControl, columnName);
      return;
    }

    let newConditionType: ConditionType = null;
    let newConditionValue: ConditionValue = null;
    if (equalConditionValue) {
      newConditionType = "equalConditionValue";
      newConditionValue = equalConditionValue;
    } else if (
      rangeCondition.overConditionValue !== null ||
      rangeCondition.underConditionValue !== null
    ) {
      newConditionType = "rangeConditionValue";
      newConditionValue = rangeCondition;
    }
    const condition: Condition = {
      columnName: columnName,
      conditionType: newConditionType,
      conditionValue: newConditionValue,
    };
    pushDataCondition(newConditionType, isControl, columnName, condition);
  };

  const handleStringConditions = (
    isControl: boolean,
    columnName: string,
    isNotCondition: boolean,
    selectedStrings: string[],
    includedString: string
  ) => {
    if (selectedStrings.length < 1 && includedString.length < 1) {
      deleteDataCondition(isControl, columnName);
      return;
    }

    let newConditionType: ConditionType = isNotCondition
      ? "notSelectedStrings"
      : "selectedStrings";
    let newConditionValue: ConditionValue = selectedStrings;
    if (includedString !== "") {
      newConditionType = isNotCondition
        ? "notIncludedString"
        : "includedString";
      newConditionValue = includedString;
    }

    const condition: Condition = {
      columnName: columnName,
      conditionType: newConditionType,
      conditionValue: newConditionValue,
    };
    pushDataCondition(newConditionType, isControl, columnName, condition);
  };

  const handleBooleanConditions = (
    isControl: boolean,
    columnName: string,
    booleanConditionValue: boolean | null
  ) => {
    if (booleanConditionValue === null) {
      deleteDataCondition(isControl, columnName);
      return;
    }

    const condition: Condition = {
      columnName: columnName,
      conditionType: "booleanConditionValue",
      conditionValue: booleanConditionValue,
    };
    pushDataCondition(
      "booleanConditionValue",
      isControl,
      columnName,
      condition
    );
  };

  const handleCreatedAtConditions = (
    isControl: boolean,
    columnName: string,
    createdAtConditionValue: CreatedAtCondition
  ) => {
    if (
      createdAtConditionValue.over === null &&
      createdAtConditionValue.under === null
    ) {
      deleteDataCondition(isControl, columnName);
      return;
    }

    const condition: Condition = {
      columnName: columnName,
      conditionType: "createdAtConditionValue",
      conditionValue: createdAtConditionValue,
    };
    pushDataCondition(
      "createdAtConditionValue",
      isControl,
      columnName,
      condition
    );
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

  const pushDataCondition = (
    newConditionType: ConditionType,
    isControl: boolean,
    columnName: string,
    condition: Condition
  ) => {
    if (newConditionType) {
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
  console.log(experimentalDataConditions);
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
              handleNumberConditions={handleNumberConditions}
              handleStringConditions={handleStringConditions}
              handleBooleanConditions={handleBooleanConditions}
              handleCreatedAtConditions={handleCreatedAtConditions}
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
              handleNumberConditions={handleNumberConditions}
              handleStringConditions={handleStringConditions}
              handleBooleanConditions={handleBooleanConditions}
              handleCreatedAtConditions={handleCreatedAtConditions}
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
