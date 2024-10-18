import { DataInfo, RangeCondition } from "@/utils/types";
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
};

export default function MetadataTable({
  dataInfo,
  isControl = false,
  handleNumberConditions,
  handleStringConditions,
}: MetadataTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>컬럼명</th>
          <th>설명</th>
          <th>데이터 타입</th>
          <th>예시</th>
          <th>필터</th>
        </tr>
      </thead>
      <tbody>
        {dataInfo.metadata.map((md, idx) => (
          <tr key={`${dataInfo.id}-${idx}`}>
            <td>{md.columnName}</td>
            <td>{md.description}</td>
            <td>{md.type}</td>
            <td>{md.example}</td>
            <td>
              <MetadataFilter
                isControl={isControl}
                url={dataInfo.url}
                apikey={dataInfo.apikey}
                metadata={md}
                handleNumberConditions={handleNumberConditions}
                handleStringConditions={handleStringConditions}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
