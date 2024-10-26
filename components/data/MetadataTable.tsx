import { Condition, DataInfo } from "@/utils/types";
import MetadataFilter from "./MetadataFilter";
import { Separator } from "../ui/separator";

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
        <tr className="text-[14px]">
          <th className="py-1 border border-[#D9D9D9] rounded-tl-[10px]">
            데이터 이름
          </th>
          <th className="py-1 border border-[#D9D9D9]">설명</th>
          <th className="py-1 border border-[#D9D9D9]">데이터 타입</th>
          <th className="py-1 border border-[#D9D9D9]">예시</th>
          <th className="py-1 border border-[#D9D9D9] rounded-tr-[10px]">
            필터
          </th>
        </tr>
      </thead>
      <tbody>
        {dataInfo.metadata.map((md, idx) => (
          <tr
            key={`${dataInfo.id}-${idx}`}
            className="hover:bg-[#f4f4f5] transition-colors duration-120 ease-in-out"
          >
            <td className="border border-[#D9D9D9] text-[14px] text-left p-2">
              {md.columnName}
            </td>
            <td className="border border-[#D9D9D9] text-[14px] text-left p-2">
              {md.description}
            </td>
            <td className="border border-[#D9D9D9] text-center p-2">
              <span className="rounded-full bg-gray-400 px-2 py-[0.8px] text-white text-[14px]">
                {md.type}
              </span>
            </td>
            <td className="border border-[#D9D9D9] text-[14px] text-left p-2">
              {md.example}
            </td>
            <td className="border border-[#D9D9D9]">
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
