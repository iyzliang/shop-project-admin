import { Request, Response, ErrorRequestHandler } from 'express'
import { EnumBaseResultCode, EnumErrorName } from '@/types'
import { OtherRequest, badRequest } from './baseResult'

/**
 * 响应未找到处理
 */
export const notFound = (req: Request, res: Response) => {
  console.log('---not')
  const result = OtherRequest(EnumBaseResultCode.NotFound)
  res.status(EnumBaseResultCode.NotFound).json(result)
}

/**
 * 响应异常处理
 */
export const errorResponse: ErrorRequestHandler = (error, req, res) => {
  console.log('-->error=====', error.name)
  if (error.name === EnumErrorName.Unauthorized) {
    const result = OtherRequest(EnumBaseResultCode.Unauthorized)
    res.status(EnumBaseResultCode.Unauthorized).json(result)
  } else if (error.name === EnumErrorName.BadRequest) {
    const result = badRequest(error.message)
    res.status(EnumBaseResultCode.BadRequest).json(result)
  } else {
    const result = OtherRequest(EnumBaseResultCode.InternalServerError)
    res.status(EnumBaseResultCode.InternalServerError).json(result)
  }
}
