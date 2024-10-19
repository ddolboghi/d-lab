import { RangeCondition } from "@/utils/types";
import { useState } from "react";

type NumberFilterProps = {
  isControl: boolean;
  columnName: string;
  handleNumberConditions: (
    isControl: boolean,
    columnName: string,
    equalConditionValue: number | null,
    rangeCondition: RangeCondition
  ) => void;
};

export default function NumberFilter({
  isControl,
  columnName,
  handleNumberConditions,
}: NumberFilterProps) {
  const [equalConditionValue, setEqualConditionValue] = useState<number | null>(
    null
  );
  const [rangeCondition, setRangeCondition] = useState<RangeCondition>({
    underConditionValue: null,
    overConditionValue: null,
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
    setEqualConditionValue(newEqualConditionValue);
    setIsFloat(false);
    handleNumberConditions(
      isControl,
      columnName,
      newEqualConditionValue,
      rangeCondition
    );
  };

  const handleUnderConditionValue = (value: string) => {
    if (value.length > 0 && !Number.isInteger(Number(value))) {
      setIsFloat(true);
      return;
    }
    const newRangeCondition = {
      ...rangeCondition,
      underConditionValue: value ? Number(value) : null,
    };
    setRangeCondition(newRangeCondition);
    setIsFloat(false);
    handleNumberConditions(
      isControl,
      columnName,
      equalConditionValue,
      newRangeCondition
    );
  };

  const handleOverConditionValue = (value: string) => {
    if (value && !Number.isInteger(Number(value))) {
      setIsFloat(true);
      return;
    }
    const newRangeCondition = {
      ...rangeCondition,
      overConditionValue: value ? Number(value) : null,
    };
    setRangeCondition(newRangeCondition);
    setIsFloat(false);
    handleNumberConditions(
      isControl,
      columnName,
      equalConditionValue,
      newRangeCondition
    );
  };

  const handleShowEqualCondition = () => {
    setShowEqualCondition(!showEqualCondition);
    if (showEqualCondition) {
      setEqualConditionValue(null);
    } else {
      setRangeCondition({
        underConditionValue: null,
        overConditionValue: null,
      });
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={handleShowEqualCondition}
          className={`${showEqualCondition ? "bg-gray-400" : "bg-blue-400"} text-white p-2`}
          disabled={!showEqualCondition}
        >
          범위 조건
        </button>
        <button
          onClick={handleShowEqualCondition}
          className={`${showEqualCondition ? "bg-blue-400" : "bg-gray-400"} text-white p-2`}
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
            value={equalConditionValue === null ? "" : equalConditionValue}
            onChange={(e) => handleEqualConditionValue(e.target.value)}
            className="border border-gray-300 rounded p-1 mx-2"
          />
        </div>
      ) : (
        <div>
          {isFloat && <p className="text-red-400">정수만 입력해주세요.</p>}
          <input
            type="number"
            pattern="\d*"
            value={
              rangeCondition.underConditionValue === null
                ? ""
                : rangeCondition.underConditionValue
            }
            onChange={(e) => handleUnderConditionValue(e.target.value)}
            className="border border-gray-300 rounded p-1 mx-2"
          />
          <span>이상</span>
          <input
            type="number"
            pattern="\d*"
            value={
              rangeCondition.overConditionValue === null
                ? ""
                : rangeCondition.overConditionValue
            }
            onChange={(e) => handleOverConditionValue(e.target.value)}
            className="border border-gray-300 rounded p-1 mx-2"
          />
          <span>이하</span>
        </div>
      )}
    </div>
  );
}
