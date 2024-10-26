import {
  Condition,
  NumberEqualCondition,
  NumberRangeCondition,
} from "@/utils/types";
import { useState } from "react";

type NumberFilterProps = {
  isControl: boolean;
  columnName: string;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function NumberFilter({
  isControl,
  columnName,
  handleCondition,
}: NumberFilterProps) {
  const [equalCondition, setEqualCondition] = useState<NumberEqualCondition>({
    columnName: columnName,
    conditionType: "equalConditionValue",
    conditionValue: null,
  });
  const [rangeCondition, setRangeCondition] = useState<NumberRangeCondition>({
    columnName: columnName,
    conditionType: "rangeConditionValue",
    conditionValue: {
      under: null,
      over: null,
    },
  });
  const [showEqualCondition, setShowEqualCondition] = useState(false);
  const [isFloat, setIsFloat] = useState(false);

  const handleEqualConditionValue = (value: string) => {
    let newEqualConditionValue = null;
    if (value.length > 0) {
      newEqualConditionValue = Number(value);
      if (!Number.isInteger(newEqualConditionValue)) {
        setIsFloat(true);
        return;
      }
    }
    const newEqualCondition = {
      ...equalCondition,
      conditionValue: newEqualConditionValue,
    };
    setEqualCondition(newEqualCondition);
    setIsFloat(false);
    handleCondition(isControl, newEqualCondition);
  };

  const handleUnderConditionValue = (value: string) => {
    if (value.length > 0 && !Number.isInteger(Number(value))) {
      setIsFloat(true);
      return;
    }

    const newRangeCondition: NumberRangeCondition = {
      ...rangeCondition,
      conditionValue: {
        ...rangeCondition.conditionValue,
        under: value ? Number(value) : null,
      },
    };
    setRangeCondition(newRangeCondition);
    setIsFloat(false);
    handleCondition(isControl, newRangeCondition);
  };

  const handleOverConditionValue = (value: string) => {
    if (value && !Number.isInteger(Number(value))) {
      setIsFloat(true);
      return;
    }
    const newRangeCondition: NumberRangeCondition = {
      ...rangeCondition,
      conditionValue: {
        ...rangeCondition.conditionValue,
        over: value ? Number(value) : null,
      },
    };
    setRangeCondition(newRangeCondition);
    setIsFloat(false);
    handleCondition(isControl, newRangeCondition);
  };

  const handleShowEqualCondition = () => {
    setShowEqualCondition(!showEqualCondition);
    if (showEqualCondition) {
      const newEqualCondition = { ...equalCondition, conditionValue: null };
      setEqualCondition(newEqualCondition);
      handleCondition(isControl, newEqualCondition);
    } else {
      const newRangeCondition = {
        ...rangeCondition,
        conditionValue: {
          under: null,
          over: null,
        },
      };
      setRangeCondition(newRangeCondition);
      handleCondition(isControl, newRangeCondition);
    }
  };

  return (
    <div className="flex flex-col justify-between items-start gap-2 p-2 text-[12px]">
      <div>
        <button
          onClick={handleShowEqualCondition}
          className={`${showEqualCondition ? "bg-gray-200 text-[#878787]" : "bg-green-400 text-white"} py-1 px-2 rounded-l-[10px]`}
          disabled={!showEqualCondition}
        >
          범위 조건
        </button>
        <button
          onClick={handleShowEqualCondition}
          className={`${showEqualCondition ? "bg-green-400 text-white" : "bg-gray-200 text-[#878787]"} py-1 px-2 rounded-r-[10px]`}
          disabled={showEqualCondition}
        >
          동등 조건
        </button>
      </div>
      {showEqualCondition ? (
        <div>
          {isFloat && <p className="text-red-400">정수만 입력해주세요.</p>}
          <span>=</span>
          <input
            type="number"
            pattern="\d*"
            value={
              equalCondition.conditionValue === null
                ? ""
                : equalCondition.conditionValue
            }
            onChange={(e) => handleEqualConditionValue(e.target.value)}
            className="border border-gray-300 w-1/2 rounded p-1"
          />
        </div>
      ) : (
        <div>
          {isFloat && <p className="text-red-400">정수만 입력해주세요.</p>}
          <input
            type="number"
            pattern="\d*"
            value={
              rangeCondition.conditionValue.under === null
                ? ""
                : rangeCondition.conditionValue.under
            }
            onChange={(e) => handleUnderConditionValue(e.target.value)}
            className="text-[12px] border border-gray-300 w-1/3 rounded p-1"
          />
          <span className="pr-2">이상</span>
          <input
            type="number"
            pattern="\d*"
            value={
              rangeCondition.conditionValue.over === null
                ? ""
                : rangeCondition.conditionValue.over
            }
            onChange={(e) => handleOverConditionValue(e.target.value)}
            className="text-[12px] border border-gray-300 w-1/3 rounded p-1"
          />
          <span>이하</span>
        </div>
      )}
    </div>
  );
}
