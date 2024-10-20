"use client";

import { BooleanCondition, Condition } from "@/utils/types";
import { useState } from "react";

type BooleanFilterProps = {
  isControl: boolean;
  columnName: string;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function BooleanFilter({
  isControl,
  columnName,
  handleCondition,
}: BooleanFilterProps) {
  const [booleanCondition, setBooleanCondition] = useState<BooleanCondition>({
    columnName: columnName,
    conditionType: "booleanConditionValue",
    conditionValue: null,
  });

  const handleSelectValue = (value: string) => {
    const newBooleanCondition = {
      ...booleanCondition,
    };
    if (value === "") {
      newBooleanCondition.conditionValue = null;
      setBooleanCondition(newBooleanCondition);
    } else if (value === "true") {
      newBooleanCondition.conditionValue = true;
      setBooleanCondition(newBooleanCondition);
    } else if (value === "false") {
      newBooleanCondition.conditionValue = false;
      setBooleanCondition(newBooleanCondition);
    }
    handleCondition(isControl, booleanCondition);
  };

  return (
    <div>
      <select
        name="type"
        value={
          booleanCondition.conditionValue === null
            ? ""
            : booleanCondition.conditionValue
              ? "true"
              : "false"
        }
        onChange={(e) => handleSelectValue(e.target.value)}
      >
        <option value="">선택 안함</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </div>
  );
}
