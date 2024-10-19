import {
  Condition,
  CreatedAtCondition,
  Metadata,
  RangeCondition,
} from "@/utils/types";

export const toSet = (array: any[]): Set<string> | Set<boolean> | Set<any> => {
  if (array.length > 0) {
    if (typeof array[0] === "string") {
      return new Set(array as string[]);
    } else if (typeof array[0] === "boolean") {
      return new Set(array as boolean[]);
    } else {
      return new Set();
    }
  } else {
    return new Set();
  }
};

export const filtering = (
  data: any[],
  metadatas: Metadata[],
  conditions: Condition[]
) => {
  data = metadataFilter(data, metadatas);
  for (const condition of conditions) {
    data = stringFilter(data, condition);
    data = numberFilter(data, condition);
    data = booleanFilter(data, condition);
    data = createdAtFilter(data, condition);
  }
  return data;
};

const metadataFilter = (data: any[], metadatas: Metadata[]) => {
  const columns = metadatas.map((metadata) => metadata.columnName);

  return data.map((item) => {
    const filteredItem: any = {};
    columns.forEach((column) => {
      if (column in item) {
        filteredItem[column] = item[column];
      }
      if ("created_at" in item) {
        filteredItem["created_at"] = item["created_at"];
      }
    });
    return filteredItem;
  });
};

const stringFilter = (data: any[], condition: Condition) => {
  const filteredData = data.filter((d) => {
    if (
      condition.conditionType === "includedString" &&
      condition.conditionValue
    ) {
      return d[condition.columnName].includes(condition.conditionValue);
    } else if (
      condition.conditionType === "notIncludedString" &&
      condition.conditionValue
    ) {
      return !d[condition.columnName].includes(condition.conditionValue);
    } else if (
      condition.conditionType === "selectedStrings" &&
      condition.conditionValue
    ) {
      const selectedStrings = condition.conditionValue as string[];
      return selectedStrings.includes(d[condition.columnName]);
    } else if (
      condition.conditionType === "notSelectedStrings" &&
      condition.conditionValue
    ) {
      const selectedStrings = condition.conditionValue as string[];
      return !selectedStrings.includes(d[condition.columnName]);
    }
    return true;
  });

  return filteredData;
};

const numberFilter = (data: any[], condition: Condition) => {
  const filteredData = data.filter((d) => {
    if (
      condition.conditionType === "equalConditionValue" &&
      condition.conditionValue
    ) {
      const equalConditionValue = condition.conditionValue as number;
      return d[condition.columnName] === equalConditionValue;
    } else if (
      condition.conditionType === "rangeConditionValue" &&
      condition.conditionValue
    ) {
      const rangeConditionValue = condition.conditionValue as RangeCondition;
      if (
        rangeConditionValue.underConditionValue !== null &&
        rangeConditionValue.overConditionValue !== null
      ) {
        return (
          rangeConditionValue.underConditionValue <= d[condition.columnName] &&
          d[condition.columnName] <= rangeConditionValue.overConditionValue
        );
      } else if (
        rangeConditionValue.underConditionValue !== null &&
        rangeConditionValue.overConditionValue === null
      ) {
        return (
          rangeConditionValue.underConditionValue <= d[condition.columnName]
        );
      } else if (
        rangeConditionValue.underConditionValue === null &&
        rangeConditionValue.overConditionValue !== null
      ) {
        return (
          d[condition.columnName] <= rangeConditionValue.overConditionValue
        );
      }
    }
    return true;
  });

  return filteredData;
};

const booleanFilter = (data: any[], condition: Condition) => {
  const filteredData = data.filter((d) => {
    if (
      condition.conditionType === "booleanConditionValue" &&
      condition.conditionValue !== null
    ) {
      return d[condition.columnName] === condition.conditionValue;
    }
    return true;
  });
  return filteredData;
};

const createdAtFilter = (data: any[], condition: Condition) => {
  const filteredData = data.filter((d) => {
    if (condition.conditionType === "createdAtConditionValue") {
      const createdAtConditionValue =
        condition.conditionValue as CreatedAtCondition;
      if (
        createdAtConditionValue.over !== null &&
        createdAtConditionValue.under !== null
      ) {
        return (
          new Date(createdAtConditionValue.over) <=
            new Date(d[condition.columnName]) &&
          new Date(d[condition.columnName]) <=
            new Date(createdAtConditionValue.under)
        );
      } else if (
        createdAtConditionValue.over !== null &&
        createdAtConditionValue.under === null
      ) {
        return (
          new Date(createdAtConditionValue.over) <=
          new Date(d[condition.columnName])
        );
      } else if (
        createdAtConditionValue.over === null &&
        createdAtConditionValue.under !== null
      ) {
        return (
          new Date(d[condition.columnName]) <=
          new Date(createdAtConditionValue.under)
        );
      }
    }
    return true;
  });
  return filteredData;
};
