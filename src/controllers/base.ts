import yshop from '@/yshop'
import { IYShop, EnumBaseResultCode, IBaseResult } from '@/types'
import createError from 'http-errors'
import IdModel from '@/models/id'

const DescbyBaseResultCode = {
  [EnumBaseResultCode.Success]: 'ok',
  [EnumBaseResultCode.Unauthorized]: '会话超时，请重新登录',
  [EnumBaseResultCode.NotFound]: '请求资源不存在',
  [EnumBaseResultCode.InternalServerError]: '服务器内部错误',
  [EnumBaseResultCode.BadRequest]: '请求错误'
}

export default class BaseController {
  $yshop: IYShop;
  $IdModel: IdModel;
  $createError: typeof createError;
  constructor () {
    this.$yshop = yshop
    this.$IdModel = yshop.getInstance(IdModel)
    this.$createError = createError
  }

  private createBaseResult <T> (code: EnumBaseResultCode, msg: string, result: T | null = null): IBaseResult<T> {
    return {
      code,
      msg,
      result,
      time: this.$yshop.getServerTime()
    }
  }

  successResponse <T> (result: T) {
    return this.createBaseResult(EnumBaseResultCode.Success, DescbyBaseResultCode[EnumBaseResultCode.Success], result)
  }

  badResponse (msg: string = DescbyBaseResultCode[EnumBaseResultCode.BadRequest]) {
    return this.createBaseResult(EnumBaseResultCode.BadRequest, msg)
  }

  OtherResponse (code: EnumBaseResultCode) {
    return this.createBaseResult(code, DescbyBaseResultCode[code])
  }

  createBadError (msg: string) {
    return createError(EnumBaseResultCode.BadRequest, msg)
  }
}
