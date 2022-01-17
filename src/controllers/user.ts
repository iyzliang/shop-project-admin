import { RequestHandler } from 'express'
import {
  IBodyRegister,
  IResponseRegister,
  EnumIdModel,
  IUserSchema,
  IBodyLogin,
  IBodyRefreshToken,
  IResponseRefreshToken,
  IBaseResult
} from '@/types'
import UserModel from '@/models/user'
import { checkUserName, checkPassword, checkPhone } from '@/utils/check'
import md5hex from '@/utils/md5hex'
import BaseController from './base'

export default class UserController extends BaseController {
  Model: UserModel
  constructor () {
    super()
    this.Model = this.$yshop.getInstance<UserModel>(UserModel)
  }

  register: RequestHandler<{}, IBaseResult<IResponseRegister>, IBodyRegister> = async (req, res, next) => {
    try {
      await this.checkRegisterParams(req.body)
      const { userName, password, phone = '' } = req.body
      const count = await this.$IdModel.getNextModelCount(EnumIdModel.UserId)
      const accessToken = this.getAccessToken(count)
      const refreshToken = this.getRefreshToken(count)
      const userDocument: IUserSchema = {
        userId: count,
        userName,
        password: md5hex(password),
        phone,
        addTime: this.$yshop.getServerTime(),
        upTime: this.$yshop.getServerTime(),
        refreshToken: refreshToken
      }
      await this.Model.save(userDocument)
      res.status(200).json(this.successResponse({
        userName,
        userId: count,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }))
    } catch (error) {
      next(error)
    }
  }

  login: RequestHandler<{}, IBaseResult<IResponseRegister>, IBodyLogin> = async (req, res, next) => {
    try {
      const userDocument = await this.checkLoginParams(req.body)
      const { userName: _userName, userId: _userId } = userDocument
      const accessToken = this.getAccessToken(_userId)
      const refreshToken = this.getRefreshToken(_userId)
      await this.Model.updateUserToken(_userId, refreshToken)
      res.status(200).json(this.successResponse({
        userName: _userName,
        userId: _userId,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }))
    } catch (error) {
      next(error)
    }
  }

  refreshToken: RequestHandler<{}, IBaseResult<IResponseRefreshToken>, IBodyRefreshToken> = async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      const _userId = await this.checkRefreshToken(refreshToken)
      const accessToken = this.getAccessToken(_userId)
      res.status(200).json(this.successResponse({
        accessToken: accessToken.token,
        expiresIn: accessToken.expiresIn
      }))
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

  private checkRegisterParams = async (body: IBodyRegister) => {
    const { userName, password, passwordAgain, phone } = body
    if (!checkUserName(userName)) {
      throw this.createBadError('用户名格式为3-16位数字、字母、中文、_')
    }
    if (!checkPassword(password)) {
      throw this.createBadError('密码格式为6-16位数字、字母、特殊字符')
    }
    if (password !== passwordAgain) {
      throw this.createBadError('两次密码不匹配')
    }
    if (phone && !checkPhone(phone)) {
      throw this.createBadError('手机号格式不正确')
    }
    const users = await this.Model.findUserByName(userName)
    if (users) {
      throw this.createBadError('用户名重复')
    }
  }

  private checkLoginParams = async (body: IBodyLogin) => {
    const { userName, password } = body
    if (!userName) {
      throw this.createBadError('用户名不能为空')
    }
    if (!password) {
      throw this.createBadError('密码不能为空')
    }
    const userDocument = await this.Model.findUserByName(userName)
    if (userDocument) {
      if (md5hex(password) !== userDocument.password) {
        throw this.createBadError('密码错误，请重新输入')
      }
      return userDocument
    } else {
      throw this.createBadError('用户名不存在')
    }
  }

  private checkRefreshToken = async (refreshToken: string) => {
    if (!this.$yshop.lodash.isString(refreshToken)) {
      throw this.createBadError('刷新凭证异常')
    }
    const decodeTokenJson = this.$yshop.decodedToken(refreshToken)
    const isString = this.$yshop.lodash.isString(decodeTokenJson)
    if (decodeTokenJson && !isString && decodeTokenJson.userId) {
      const userDocument = await this.Model.findUserById(decodeTokenJson.userId as number)
      if (userDocument && userDocument.refreshToken) {
        const { refreshToken: _refreshToken } = userDocument
        if (!this.$yshop.dayjs().isBefore(this.$yshop.dayjs.unix(_refreshToken.expiresIn))) {
          throw this.createBadError('刷新凭证已过期')
        }
        return userDocument.userId
      } else {
        throw this.createBadError('刷新凭证异常')
      }
    } else {
      throw this.createBadError('刷新凭证异常')
    }
  }
}
