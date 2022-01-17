export interface ISpecSchema {
  specId: number;
  label: string;
  sort: number;
  display: boolean;
  unit: string;
  addTime: string;
  upTime: string;
  createUserId: number;
}

export interface ISpecData {
  specId: number;
  label: string;
  unit: string;
  sort: number;
  display: boolean;
  upTime: string;
}

export interface IPostBodySpec {
  label: string;
  unit: string;
  sort?: number;
  display?: boolean;
}

export interface IGetParamsSpec {
  page?: number;
  perPage?: number;
  label?: string;
  specId?: number;
}

export interface IPutParamsSpec {
  specId: string;
}

export interface IPutBodySpec {
  label?: string;
  unit?: string;
  sort?: number;
  display?: boolean;
}
