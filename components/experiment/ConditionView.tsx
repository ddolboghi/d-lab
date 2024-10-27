import { formatDateString } from "@/lib/dateTranslator";
import { Condition } from "@/utils/types";

type ConditionViewProps = {
  condition: Condition;
};

export default function ConditionView({ condition }: ConditionViewProps) {
  if (condition.conditionType === "includedString") {
    return (
      <p>
        {condition.columnName}에서{" "}
        <span className="font-semibold">{condition.conditionValue}</span>
        이(가) 포함된 데이터들만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "notIncludedString") {
    return (
      <p>
        {condition.columnName}에서{" "}
        <span className="font-semibold">{condition.conditionValue}</span>
        이(가) 포함되지 않은 데이터들만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "selectedStrings") {
    return (
      <p>
        {condition.columnName}에서{" "}
        <span className="font-semibold">
          {condition.conditionValue?.toString()}
        </span>
        만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "notSelectedStrings") {
    return (
      <p>
        {condition.columnName}에서{" "}
        <span className="font-semibold">
          {condition.conditionValue?.toString()}
        </span>
        을(를) 제외합니다.
      </p>
    );
  } else if (condition.conditionType === "equalConditionValue") {
    return (
      <p>
        {condition.columnName}이{" "}
        <span className="font-semibold">{condition.conditionValue}</span>인
        데이터들만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "rangeConditionValue") {
    return (
      <p>
        {condition.columnName}이{" "}
        {condition.conditionValue.over && (
          <span className="font-semibold">
            {condition.conditionValue.over}이상
          </span>
        )}{" "}
        {condition.conditionValue.under && (
          <span className="font-semibold">
            {condition.conditionValue.under}이하
          </span>
        )}
        인 데이터들만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "booleanConditionValue") {
    return (
      <p>
        {condition.columnName}이{" "}
        <span className="font-semibold">
          {condition.conditionValue ? "True" : "False"}
        </span>
        인 데이터들만 추출합니다.
      </p>
    );
  } else if (condition.conditionType === "createdAtConditionValue") {
    return (
      <p>
        {condition.conditionValue.over && (
          <span className="font-semibold">
            {formatDateString(condition.conditionValue.over)}부터
          </span>
        )}{" "}
        {condition.conditionValue.under && (
          <span className="font-semibold">
            {formatDateString(condition.conditionValue.under)}까지
          </span>
        )}
        생성된 데이터들만 추출합니다.
      </p>
    );
  }

  return <p>필터링을 설정하지 않았습니다.</p>;
}
