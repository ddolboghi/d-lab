"use client";

import { CreatedAtCondition } from "@/utils/types";
import { useState } from "react";

type CreatedAtFilterProps = {
  isControl: boolean;
  columnName: string;
  handleCreatedAtConditions: (
    isControl: boolean,
    columnName: string,
    createdAtConditionValue: CreatedAtCondition
  ) => void;
};

export default function CreatedAtFilter({
  isControl,
  columnName,
  handleCreatedAtConditions,
}: CreatedAtFilterProps) {
  const [createdAtConditionValue, setCreatedAtConditionValue] =
    useState<CreatedAtCondition>({
      over: null,
      under: null,
    });

  const handleCreatedAtConditionValue = (isOver: boolean, value: any) => {
    let newValue = value === "" ? null : value;
    let newCreatedAtConditionValue = {
      ...createdAtConditionValue,
    };
    if (isOver) {
      newCreatedAtConditionValue.over = newValue;
      setCreatedAtConditionValue(newCreatedAtConditionValue);
    } else {
      newCreatedAtConditionValue.under = newValue;
      setCreatedAtConditionValue(newCreatedAtConditionValue);
    }
    handleCreatedAtConditions(
      isControl,
      columnName,
      newCreatedAtConditionValue
    );
  };

  return (
    <div>
      <input
        type="datetime-local"
        name="endTime"
        className="border border-gray-300 rounded p-1 mx-2"
        onChange={(e) => handleCreatedAtConditionValue(true, e.target.value)}
      />
      <span>이상</span>
      <input
        type="datetime-local"
        name="endTime"
        className="border border-gray-300 rounded p-1 mx-2"
        onChange={(e) => handleCreatedAtConditionValue(false, e.target.value)}
      />
      <span>이하</span>
    </div>
  );
}
