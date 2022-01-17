export enum EnumIdModel {
  UserId = 'userId',
  SpecId = 'specId'
}

export interface IId {
  model: EnumIdModel;
  count: number;
}
