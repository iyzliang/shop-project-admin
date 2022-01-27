import { ISpecData } from './spec'

export enum EnumProductStatus {
  /**
   * 上架
   */
  OnShelf = 1,
  /**
   * 下架
   */
  OffShelf = 2,
  /**
   * 售罄
   */
  SellOut = 3
}

export interface IProductData {
  id: number;
  name: string;
  alias: string;
  isNew: boolean;
  detail: string;
  stock: number;
  limitStock: number;
  salesPrice: number;
  costPrice: number;
  marketPrice: number;
  initSales: number;
  limitQuantity: number;
  status: EnumProductStatus;
  specification: ISpecData;
}

export interface IProductSchema extends IProductData {
  addTime: string;
  upTime: string;
  createUserId: number;
}
