import { Condition, DataInfo } from "@/utils/types";
import MetadataTable from "../data/MetadataTable";

type DataSelectSectionProps = {
  label: string;
  formName: string;
  dataInfo: DataInfo | null;
  serviceDatas: DataInfo[] | null;
  handleDataChange: (isExperimentData: boolean, value: string) => void;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function DataSelectSection({
  label,
  formName,
  dataInfo,
  serviceDatas,
  handleDataChange,
  handleCondition,
}: DataSelectSectionProps) {
  return (
    <section className="flex flex-col items-start gap-[8px]">
      <label htmlFor={formName} className="text-[#4E4E4E]">
        {label}
      </label>
      <select
        name={formName}
        value={dataInfo?.id}
        onChange={(e) => handleDataChange(true, e.target.value)}
        className="border border-[#E3E3E3] rounded-[5px] bg-white py-2 pl-4 pr-2 text-[12px]"
      >
        <option value="">선택 안함</option>
        {serviceDatas &&
          serviceDatas.map((data) => (
            <option key={data.id} value={data.id}>
              {data.title}
            </option>
          ))}
      </select>
      {dataInfo && (
        <MetadataTable dataInfo={dataInfo} handleCondition={handleCondition} />
      )}
    </section>
  );
}
