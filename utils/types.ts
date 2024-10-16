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
  apikey: string;
  metadata: Metadata[];
  created_at: Date;
}

export interface Experiment {
  id: number;
  service_id: number;
  title: string;
  overview: string;
  end_time: Date;
  experimental_data_id: number;
  experimental_data_preprocessing_id: number;
  control_data_id: number;
  control_data_preprocessing_id: number;
  goal: number;
}

export interface ExperimentForRead extends Experiment {
  created_at: Date;
  conclusion: string;
}

export interface ExperimentForUpdate {
  id: number;
  title: string;
  overview: string;
  goal: number;
  conclusion: string;
}
