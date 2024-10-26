import { fetchLogDataByMetadataForFilter } from "@/actions/connectData";
import {
  Condition,
  headerPair,
  Metadata,
  StringArrayCondition,
  StringIncludedCondition,
} from "@/utils/types";
import { useEffect, useState } from "react";
import NumberFilter from "./NumberFilter";
import BooleanFilter from "./BooleanFilter";
import CreatedAtFilter from "./CreatedAtFilter";

type MetadataFilterProps = {
  isControl: boolean;
  url: string;
  headerPairs: headerPair[];
  metadata: Metadata;
  handleCondition: (isControl: boolean, condition: Condition) => void;
};

export default function MetadataFilter({
  isControl,
  url,
  headerPairs,
  metadata,
  handleCondition,
}: MetadataFilterProps) {
  const [filterOptions, setFilterOptions] = useState<Array<any>>([]);
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [isNotCondition, setIsNotCondition] = useState(false);
  const [includedCondition, setIncludedCondition] =
    useState<StringIncludedCondition>({
      columnName: metadata.columnName,
      conditionType: isNotCondition ? "notIncludedString" : "includedString",
      conditionValue: null,
    });
  const [arrayCondition, setArrayCondition] = useState<StringArrayCondition>({
    columnName: metadata.columnName,
    conditionType: isNotCondition ? "notSelectedStrings" : "selectedStrings",
    conditionValue: null,
  });
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const getFilterOption = async () => {
      if (metadata.type === "string") {
        const response = await fetchLogDataByMetadataForFilter(
          url,
          headerPairs,
          metadata
        );
        if (response) {
          setFilterOptions(response);
        }
      }
    };
    getFilterOption();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newSelectedStrings: string[] | null = [...selectedStrings, value];
    if (selectedStrings.includes(value)) {
      newSelectedStrings = selectedStrings.filter((v) => v !== value);
    }
    if (newSelectedStrings.length < 1) {
      newSelectedStrings = null;
    }
    setSelectedStrings(newSelectedStrings === null ? [] : newSelectedStrings);
    const newCondition: StringArrayCondition = {
      ...arrayCondition,
      conditionType: isNotCondition ? "notSelectedStrings" : "selectedStrings",
      conditionValue: newSelectedStrings,
    };
    setArrayCondition(newCondition);
    handleCondition(isControl, newCondition);
  };

  const handleIncludedString = (value: string) => {
    let newIncludedString: string | null = value === "" ? null : value;
    const newCondition: StringIncludedCondition = {
      ...includedCondition,
      conditionType: isNotCondition ? "notIncludedString" : "includedString",
      conditionValue: newIncludedString,
    };
    setIncludedCondition(newCondition);
    handleCondition(isControl, newCondition);
  };

  const handleIsNotCondition = () => {
    setIsNotCondition(!isNotCondition);
    if (includedCondition.conditionValue !== null) {
      const newIncludedCondition = {
        ...includedCondition,
        conditionType: !isNotCondition
          ? ("notIncludedString" as "notIncludedString")
          : ("includedString" as "includedString"),
      };
      setIncludedCondition(newIncludedCondition);
      handleCondition(isControl, newIncludedCondition);
    } else if (arrayCondition.conditionValue !== null) {
      const newArrayCondition = {
        ...arrayCondition,
        conditionType: !isNotCondition
          ? ("notSelectedStrings" as "notSelectedStrings")
          : ("selectedStrings" as "selectedStrings"),
      };
      setArrayCondition(newArrayCondition);
      handleCondition(isControl, newArrayCondition);
    }
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
    if (showOptions) {
      const initIncludedCondition = {
        columnName: metadata.columnName,
        conditionType: "includedString" as "includedString",
        conditionValue: null,
      };
      setIncludedCondition(initIncludedCondition);
      handleCondition(isControl, initIncludedCondition);
    } else {
      setSelectedStrings([]);
      const initArrayCondition = {
        columnName: metadata.columnName,
        conditionType: "selectedStrings" as "selectedStrings",
        conditionValue: null,
      };
      setArrayCondition(initArrayCondition);
      handleCondition(isControl, initArrayCondition);
    }
  };

  if (metadata.type === "number") {
    return (
      <NumberFilter
        isControl={isControl}
        columnName={metadata.columnName}
        handleCondition={handleCondition}
      />
    );
  } else if (metadata.type === "boolean") {
    return (
      <BooleanFilter
        isControl={isControl}
        columnName={metadata.columnName}
        handleCondition={handleCondition}
      />
    );
  } else if (metadata.description === "created_at") {
    return (
      <CreatedAtFilter
        isControl={isControl}
        columnName={metadata.columnName}
        handleCondition={handleCondition}
      />
    );
  }
  return (
    <div className="flex flex-col justify-between items-start gap-2 p-2">
      <div className="text-[12px]">
        <button
          onClick={handleShowOptions}
          className={`${showOptions ? "bg-gray-200 text-[#878787]" : "bg-green-400 text-white"} py-1 px-2 rounded-l-[10px]`}
          disabled={!showOptions}
        >
          포함된 문자
        </button>
        <button
          onClick={handleShowOptions}
          className={`${showOptions ? "bg-green-400 text-white" : "bg-gray-200 text-[#878787]"} py-1 px-2 rounded-r-[10px]`}
          disabled={showOptions}
        >
          문자 선택
        </button>
        <label className="pl-2">
          <input
            type="checkbox"
            checked={isNotCondition}
            onChange={handleIsNotCondition}
          />
          미포함
        </label>
      </div>
      {showOptions ? (
        <div className="text-[12px] max-h-[120px] w-full border border-gray-300 p-2 overflow-auto scrollbar-custom">
          {filterOptions.map((filterOption, idx) => (
            <div key={`${metadata.columnName}-${idx}`}>
              <label>
                <input
                  type="checkbox"
                  value={filterOption}
                  checked={selectedStrings.includes(filterOption)}
                  onChange={handleCheckboxChange}
                />
                {filterOption}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={
            includedCondition.conditionValue
              ? includedCondition.conditionValue
              : ""
          }
          className="border border-gray-300 rounded p-1 text-[12px]"
          onChange={(e) => handleIncludedString(e.target.value)}
        />
      )}
    </div>
  );
}
