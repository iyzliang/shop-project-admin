import { EnumBaseResultCode } from '@/types/index'
import dayjs from 'dayjs'
const DescbyBaseResultCode = {
  [EnumBaseResultCode.Success]: 'ok',
  [EnumBaseResultCode.Unauthorized]: '会话超时，请重新登录',
  [EnumBaseResultCode.NotFound]: '请求资源不存在',
  [EnumBaseResultCode.InternalServerError]: '服务器内部错误',
  [EnumBaseResultCode.BadRequest]: '请求错误'
}

export default class BaseResult<T> {
  private code;
  private msg;
  private time;
  private result;
  constructor (code: EnumBaseResultCode, msg: string, result: T | null = null) {
    this.code = code
    this.msg = msg
    this.result = result
    this.time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  static success<T> (result: T) {
    return new BaseResult<T>(EnumBaseResultCode.Success, DescbyBaseResultCode[EnumBaseResultCode.Success], result)
  }

  static badRequest (msg: string) {
    return new BaseResult(EnumBaseResultCode.BadRequest, msg)
  }

  static Other (code: EnumBaseResultCode) {
    return new BaseResult(code, DescbyBaseResultCode[code])
  }
}
