export enum EnumIdModel {
  UserId = 'userId',
  SpecId = 'specId',
  PictureId = 'pictureId'
}

export interface IId {
  model: EnumIdModel;
  count: number;
}
