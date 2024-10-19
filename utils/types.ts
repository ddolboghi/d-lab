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
  conclusion: string | null;
}

export interface ExperimentForUpdate {
  id: number;
  title: string;
  overview: string;
  goal: number;
  conclusion: string | null;
}

/* 필터 조건 타입 */

export type Condition = {
  columnName: string;
  conditionType: ConditionType;
  conditionValue: ConditionValue;
};

export type ConditionType =
  | "includedString"
  | "notIncludedString"
  | "selectedStrings"
  | "notSelectedStrings"
  | "equalConditionValue"
  | "rangeConditionValue"
  | "booleanConditionValue"
  | "createdAtConditionValue"
  | null;

export type ConditionValue =
  | string
  | string[]
  | number
  | RangeCondition
  | boolean
  | CreatedAtCondition
  | null;

export type RangeCondition = {
  underConditionValue: number | null;
  overConditionValue: number | null;
};

export type CreatedAtCondition = {
  under: string | null;
  over: string | null;
};

/* signin */
export interface Signin {
  password: string;
}
