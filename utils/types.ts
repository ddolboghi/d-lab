export interface Metadata {
  columnName: string;
  description: string;
  type: string;
  example: string;
}

export interface Service {
  name: string;
}

export interface ServiceWithId extends Service {
  id: number;
}

export interface ServiceWithCreatedAt extends ServiceWithId {
  created_at: Date;
}

export interface DataInfo {
  id: number;
  title: string;
  url: string;
  headers: headerPair[];
  metadata: Metadata[];
  created_at: Date;
}

export type headerPair = { id: number; key: string; value: string };

export interface DataInfoForConenct {
  title: string;
  url: string;
  headers: headerPair[];
  metadata: Metadata[];
}

/* 실험 타입 */

export interface Experiment {
  title: string;
  overview: string;
  end_time: string | null;
  experimental_data_id: number;
  experimental_data_conditions: Condition[];
  control_data_id: number;
  control_data_conditions: Condition[];
  goal: number;
}

export interface ExperimentForRead extends Experiment {
  id: number;
  service_id: number;
  created_at: string;
  conclusion: Conclusion | null;
}

export interface ExperimentForUpdate {
  id: number;
  title: string;
  overview: string;
  goal: number;
  conclusion: Conclusion | null;
}

export type Conclusion = { actual: number | null; result: boolean };

/* 필터 조건 타입 */

export type Condition =
  | StringIncludedCondition
  | StringArrayCondition
  | NumberEqualCondition
  | NumberRangeCondition
  | BooleanCondition
  | CreatedAtCondition;

export type StringIncludedCondition = {
  columnName: string;
  conditionType: "includedString" | "notIncludedString";
  conditionValue: string | null;
};

export type StringArrayCondition = {
  columnName: string;
  conditionType: "selectedStrings" | "notSelectedStrings";
  conditionValue: string[] | null;
};

export type NumberEqualCondition = {
  columnName: string;
  conditionType: "equalConditionValue";
  conditionValue: number | null;
};

export type NumberRangeCondition = {
  columnName: string;
  conditionType: "rangeConditionValue";
  conditionValue: {
    under: number | null;
    over: number | null;
  };
};

export type BooleanCondition = {
  columnName: string;
  conditionType: "booleanConditionValue";
  conditionValue: boolean | null;
};

export type CreatedAtCondition = {
  columnName: string;
  conditionType: "createdAtConditionValue";
  conditionValue: {
    under: string | null;
    over: string | null;
  };
};

/* signin */
export interface Signin {
  password: string;
}
