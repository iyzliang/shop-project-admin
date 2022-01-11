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
