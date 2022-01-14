import { Request, Response, ErrorRequestHandler } from 'express'
import { EnumBaseResultCode, EnumErrorName } from '@/types'
import yshop from '@/yshop'
import BaseController from '@/controllers/base'

const baseController = yshop.getInstance(BaseController)
/**
 * 响应未找到处理
 */
export const notFound = (req: Request, res: Response) => {
  const result = baseController.OtherResponse(EnumBaseResultCode.NotFound)
  res.status(EnumBaseResultCode.NotFound).json(result)
}

/**
 * 响应异常处理
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorResponse: ErrorRequestHandler = (error, req, res, next) => {
  if (error.name === EnumErrorName.Unauthorized) {
    const result = baseController.OtherResponse(EnumBaseResultCode.Unauthorized)
    res.status(EnumBaseResultCode.Unauthorized).json(result)
  } else if (error.name === EnumErrorName.BadRequest) {
    const result = baseController.badResponse(error.message)
    res.status(EnumBaseResultCode.BadRequest).json(result)
  } else {
    console.log('---', error)
    const result = baseController.OtherResponse(EnumBaseResultCode.InternalServerError)
    res.status(EnumBaseResultCode.InternalServerError).json(result)
  }
}
