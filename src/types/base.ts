import { Express } from 'express'
import dayjs from 'dayjs'
import lodash from 'lodash'
import jwt from 'jsonwebtoken'
import NodeCache from 'node-cache'

export enum EnumBaseResultCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

export interface IBaseResult<T> {
  code: EnumBaseResultCode;
  msg: string;
  result: T | null;
  time: string;
}

export enum EnumErrorName {
  /**
   * 400 客户端请求的语法错误，服务器无法理解
   */
  BadRequest = 'BadRequestError',
  /**
   * 401 请求要求用户的身份认证
   */
  Unauthorized = 'UnauthorizedError',
  /**
   * 500 服务器内部错误，无法完成请求
   */
  InternalServer = 'InternalServerError'
}

export interface IEnv {
  serverPort: number;
  logPath: string;
  privateKey: string;
  refreshPrivateKey: string;
  shopDBUser: string;
  shopDBPwd: string;
  shopDBHost: string;
  shopDBPort: number;
  shopDBName: string;
  qAccessKey: string;
  qSecretKey: string;
}
export enum EnumEnv {
  Localhost = 'localhost',
  Development = 'development',
  Production = 'production'
}
export type IConfig = Record<EnumEnv, IEnv>
export type GetInstance = <T>(M: new(...arg: any[]) => T, ...arg: any[]) => T
export type DelInstance = <T>(M: new(...arg: any[]) => T) => void
export interface IYShop extends IEnv {
  shopNodeEnv: EnumEnv;
  getInstance: GetInstance;
  delInstance: DelInstance;
  app?: Express;
  dayjs: typeof dayjs;
  lodash: typeof lodash;
  getServerTime: () => string;
  initAccessToken: (info: string | Buffer | object) => string;
  initRefreshToken: (info: string | Buffer | object) => string;
  decodedToken: (token: string) => string | jwt.JwtPayload | null;
  myCache: NodeCache;
  accessTokenExp: number;
  refreshTokenExp: number;
}

export interface IResultList<T> {
  page: number;
  perPage: number;
  totalNumber: number;
  totalPage: number;
  data: T[];
}
