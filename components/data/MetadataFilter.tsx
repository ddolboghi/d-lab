import { fetchLogDataByMetadataForFilter } from "@/actions/connectData";
import { Metadata, RangeCondition } from "@/utils/types";
import { useEffect, useState } from "react";
import NumberFilter from "./NumberFilter";

type MetadataFilterProps = {
  isControl: boolean;
  url: string;
  apikey: string;
  metadata: Metadata;
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

export default function MetadataFilter({
  isControl,
  url,
  apikey,
  metadata,
  handleNumberConditions,
  handleStringConditions,
}: MetadataFilterProps) {
  const [filterOptions, setFilterOptions] = useState<Array<any>>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [includedString, setIncludedString] = useState<string>("");
  const [isNotCondition, setIsNotCondition] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const getFilterOption = async () => {
      if (metadata.type !== "number") {
        const response = await fetchLogDataByMetadataForFilter(
          url,
          apikey,
          metadata
        );
        if (response) {
          setFilterOptions(response);
        }
      }
    };
    if (showOptions) {
      getFilterOption();
    }
  }, [showOptions]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newSelectedValues = [...selectedValues, value];
    if (selectedValues.includes(value)) {
      newSelectedValues = selectedValues.filter((v) => v !== value);
    }
    setSelectedValues(newSelectedValues);
    handleStringConditions(
      isControl,
      metadata.columnName,
      isNotCondition,
      newSelectedValues,
      includedString
    );
  };

  const handleIncludedString = (value: string) => {
    setIncludedString(value);
    handleStringConditions(
      isControl,
      metadata.columnName,
      isNotCondition,
      selectedValues,
      value
    );
  };

  const handleIsNotCondition = () => {
    setIsNotCondition(!isNotCondition);
    handleStringConditions(
      isControl,
      metadata.columnName,
      !isNotCondition,
      selectedValues,
      includedString
    );
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
    if (showOptions) {
      setSelectedValues([]);
    } else {
      setIncludedString("");
    }
  };

  if (metadata.type === "number") {
    return (
      <NumberFilter
        isControl={isControl}
        columnName={metadata.columnName}
        handleNumberConditions={handleNumberConditions}
      />
    );
  } else if (metadata.type === "boolean") {
    return <div>boolean filter</div>;
  }
  return (
    <div>
      <div>
        <button
          onClick={handleShowOptions}
          className={`${showOptions ? "bg-gray-400" : "bg-blue-400"} text-white p-2`}
          disabled={!showOptions}
        >
          포함된 문자
        </button>
        <button
          onClick={handleShowOptions}
          className={`${showOptions ? "bg-blue-400" : "bg-gray-400"} text-white p-2`}
          disabled={showOptions}
        >
          문자 선택
        </button>
        <label>
          <input
            type="checkbox"
            checked={isNotCondition}
            onChange={handleIsNotCondition}
          />
          미포함
        </label>
      </div>
      {showOptions ? (
        <div className="max-h-60 overflow-y-auto border border-gray-300 p-2">
          {filterOptions.map((filterOption, idx) => (
            <div key={`${metadata.columnName}-${idx}`}>
              <label>
                <input
                  type="checkbox"
                  value={filterOption}
                  checked={selectedValues.includes(filterOption)}
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
          value={includedString}
          className="border border-gray-300 rounded p-1 mx-2"
          onChange={(e) => handleIncludedString(e.target.value)}
        />
      )}
    </div>
  );
}
