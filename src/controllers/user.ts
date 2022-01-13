import { RequestHandler, Request } from 'express'
import { ILoginParams, EnumIdModel, IUserSchema, IResponseRegister } from '@/types'
import UserModel from '@/models/user'
import { checkUserName, checkPassword, checkPhone } from '@/utils/check'
import BaseController from './base'

export default class UserController extends BaseController {
  Model: UserModel;
  constructor () {
    super()
    this.Model = this.$yshop.getInstance<UserModel>(UserModel)
  }

  register: RequestHandler = async (req: Request<{}, {}, ILoginParams>, res, next) => {
    try {
      await this.checkRegisterParams(req.body)
      const { userName, password, phone = '' } = req.body
      const { count } = await this.$IdModel.getNextModelCount(EnumIdModel.UserId)
      const accessToken = this.getAccessToken(count)
      const refreshToken = this.getRefreshToken(count)
      const userDocument: IUserSchema = {
        userId: count,
        userName,
        password,
        phone,
        addTime: this.$yshop.getServerTime(),
        upTime: this.$yshop.getServerTime(),
        refreshToken: refreshToken
      }
      const responseRegister: IResponseRegister = {
        userName,
        userId: count,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }
      await this.Model.save(userDocument)
      res.status(200).json(this.successResponse(responseRegister))
    } catch (error) {
      next(error)
    }
  }

  private getAccessToken = (id: number) => {
    const accessExp = this.$yshop.dayjs().add(60 * 60, 's').unix()
    return {
      token: this.$yshop.initAccessToken({
        userId: id,
        exp: accessExp
      }),
      expiresIn: accessExp
    }
  }

  private getRefreshToken = (id: number) => {
    const refreshExp = this.$yshop.dayjs().add(60 * 60 * 48, 's').unix()
    return {
      token: this.$yshop.initRefreshToken({
        userId: id,
        exp: refreshExp
      }),
      expiresIn: refreshExp
    }
  }

  checkRegisterParams = async (params: ILoginParams) => {
    const { userName, password, passwordAgain, phone } = params
    if (!checkUserName(userName)) {
      throw this.createBadError('用户名不能为空')
    }
    if (!checkPassword(password)) {
      throw this.createBadError('密码不能为空')
    }
    if (password !== passwordAgain) {
      throw this.createBadError('两次密码不匹配')
    }
    if (phone && !checkPhone(phone)) {
      throw this.createBadError('手机号格式不正确')
    }
    const users = await this.Model.findUserByName(userName)
    if (users.length) {
      throw this.createBadError('用户名重复')
    }
  }
}
