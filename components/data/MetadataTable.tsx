import { Condition, DataInfo } from "@/utils/types";
import MetadataFilter from "./MetadataFilter";

type MetadataTableProps = {
  dataInfo: DataInfo;
  isControl?: boolean;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function MetadataTable({
  dataInfo,
  isControl = false,
  handleCondition,
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
                handleCondition={handleCondition}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
