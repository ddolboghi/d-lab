export interface Metadata {
  name: string;
  type: string;
  example: string;
}

export interface Service {
  name: string;
}

export interface ServiceWithId extends Service {
  id: number;
}
