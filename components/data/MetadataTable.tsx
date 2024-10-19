import { CreatedAtCondition, DataInfo, RangeCondition } from "@/utils/types";
import MetadataFilter from "./MetadataFilter";

type MetadataTableProps = {
  dataInfo: DataInfo;
  isControl?: boolean;
  handleNumberConditions: (
    isControl: boolean,
    columnName: string,
    equalConditionValue: number | null,
    rangeCondition: RangeCondition
  ) => void;
  handleStringConditions: (
    isControl: boolean,
    columnName: string,
    isNotCondition: boolean,
    selectedStrings: string[],
    includedString: string
  ) => void;
  handleBooleanConditions: (
    isControl: boolean,
    columnName: string,
    booleanConditionValue: boolean | null
  ) => void;
  handleCreatedAtConditions: (
    isControl: boolean,
    columnName: string,
    createdAtConditionValue: CreatedAtCondition
  ) => void;
};

export default function MetadataTable({
  dataInfo,
  isControl = false,
  handleNumberConditions,
  handleStringConditions,
  handleBooleanConditions,
  handleCreatedAtConditions,
}: MetadataTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="border border-black">컬럼명</th>
          <th className="border border-black">설명</th>
          <th className="border border-black">데이터 타입</th>
          <th className="border border-black">예시</th>
          <th className="border border-black">필터</th>
        </tr>
      </thead>
      <tbody>
        {dataInfo.metadata.map((md, idx) => (
          <tr key={`${dataInfo.id}-${idx}`}>
            <td className="border border-black">{md.columnName}</td>
            <td className="border border-black">{md.description}</td>
            <td className="border border-black">{md.type}</td>
            <td className="border border-black">{md.example}</td>
            <td className="border border-black">
              <MetadataFilter
                isControl={isControl}
                url={dataInfo.url}
                headerPairs={dataInfo.headers}
                metadata={md}
                handleNumberConditions={handleNumberConditions}
                handleStringConditions={handleStringConditions}
                handleBooleanConditions={handleBooleanConditions}
                handleCreatedAtConditions={handleCreatedAtConditions}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
