"use client";

import { Condition, CreatedAtCondition } from "@/utils/types";
import { useState } from "react";

type CreatedAtFilterProps = {
  isControl: boolean;
  columnName: string;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function CreatedAtFilter({
  isControl,
  columnName,
  handleCondition,
}: CreatedAtFilterProps) {
  const [createdAtCondition, setCreatedAtCondition] =
    useState<CreatedAtCondition>({
      columnName: columnName,
      conditionType: "createdAtConditionValue",
      conditionValue: {
        under: null,
        over: null,
      },
    });

  const handleCreatedAtCondition = (isOver: boolean, value: any) => {
    let newValue = value === "" ? null : value;
    let newCreatedAtCondition: CreatedAtCondition = {
      ...createdAtCondition,
    };
    if (isOver) {
      newCreatedAtCondition.conditionValue.over = newValue;
      setCreatedAtCondition(newCreatedAtCondition);
    } else {
      newCreatedAtCondition.conditionValue.under = newValue;
      setCreatedAtCondition(newCreatedAtCondition);
    }
    handleCondition(isControl, createdAtCondition);
  };

  return (
    <div>
      <input
        type="datetime-local"
        name="endTime"
        className="border border-gray-300 rounded p-1 mx-2"
        onChange={(e) => handleCreatedAtCondition(true, e.target.value)}
      />
      <span>이상</span>
      <input
        type="datetime-local"
        name="endTime"
        className="border border-gray-300 rounded p-1 mx-2"
        onChange={(e) => handleCreatedAtCondition(false, e.target.value)}
      />
      <span>이하</span>
    </div>
  );
}
