import { EnumBaseResultCode, IBaseResult } from '@/types/index'
import dayjs from 'dayjs'
const DescbyBaseResultCode = {
  [EnumBaseResultCode.Success]: 'ok',
  [EnumBaseResultCode.Unauthorized]: '会话超时，请重新登录',
  [EnumBaseResultCode.NotFound]: '请求资源不存在',
  [EnumBaseResultCode.InternalServerError]: '服务器内部错误',
  [EnumBaseResultCode.BadRequest]: '请求错误'
}

const createBaseResult = <T>(code: EnumBaseResultCode, msg: string, result: T | null = null): IBaseResult<T> => {
  return {
    code,
    msg,
    result,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
}

export const success = <T>(result: T) => {
  return createBaseResult(EnumBaseResultCode.Success, DescbyBaseResultCode[EnumBaseResultCode.Success], result)
}

export const badRequest = (msg: string = DescbyBaseResultCode[EnumBaseResultCode.BadRequest]) => {
  return createBaseResult(EnumBaseResultCode.BadRequest, msg)
}

export const OtherRequest = (code: EnumBaseResultCode) => {
  return createBaseResult(code, DescbyBaseResultCode[code])
}
