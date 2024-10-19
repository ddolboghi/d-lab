"use client";

import { useState } from "react";

type BooleanFilterProps = {
  isControl: boolean;
  columnName: string;
  handleBooleanConditions: (
    isControl: boolean,
    columnName: string,
    booleanConditionValue: boolean | null
  ) => void;
};

export default function BooleanFilter({
  isControl,
  columnName,
  handleBooleanConditions,
}: BooleanFilterProps) {
  const [value, setValue] = useState("");

  const handleSelectValue = (value: string) => {
    if (value === "") {
      setValue("");
      handleBooleanConditions(isControl, columnName, null);
    } else if (value === "true") {
      setValue("true");
      handleBooleanConditions(isControl, columnName, true);
    } else if (value === "false") {
      setValue("false");
      handleBooleanConditions(isControl, columnName, false);
    }
  };

  return (
    <div>
      <select
        name="type"
        value={value}
        onChange={(e) => handleSelectValue(e.target.value)}
      >
        <option value="">선택 안함</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </div>
  );
}
