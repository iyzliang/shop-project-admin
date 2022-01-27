import { RequestHandler } from 'express'
import {
  IBodyRegister,
  IResponseRegister,
  EnumIdModel,
  IUserSchema,
  IBodyLogin,
  IBodyRefreshToken,
  IResponseRefreshToken,
  IBaseResult,
  EnumCacheKey,
  ITokenModel
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

  /**
   * 用户注册
   * @interface /api/admin/user/v1/register
   * @method POST
   * @category user
   * @param {String} userName 用户名，不能为空
   * @param {String} password 密码，不能为空
   * @param {String} passwordAgain 确定密码
   * @param {String} phone 手机号，选填
   */
  register: RequestHandler<{}, IBaseResult<IResponseRegister>, IBodyRegister> = async (req, res, next) => {
    try {
      const { userName, password, phone = '' } = await this.checkRegisterParams(req.body)
      const userId = await this.$IdModel.getNextModelCount(EnumIdModel.UserId)
      const accessToken = this.getAccessToken(userId)
      const refreshToken = this.getRefreshToken(userId)
      this.$yshop.myCache.set<ITokenModel>(`${EnumCacheKey.RefreshToken}-${userId}`, refreshToken)
      const userDocument: IUserSchema = {
        userId,
        userName,
        password: md5hex(password),
        phone,
        addTime: this.$yshop.getServerTime(),
        upTime: this.$yshop.getServerTime()
      }
      await this.Model.save(userDocument)
      res.status(200).json(this.successResponse({
        userName,
        userId,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 登录
   * @interface /api/admin/user/v1/login
   * @method POST
   * @category user
   * @param {String} userName 用户名，不能为空
   * @param {String} password 密码，不能为空
   */
  login: RequestHandler<{}, IBaseResult<IResponseRegister>, IBodyLogin> = async (req, res, next) => {
    try {
      const { userName, userId } = await this.checkLoginParams(req.body)
      const accessToken = this.getAccessToken(userId)
      const refreshToken = this.getRefreshToken(userId)
      this.$yshop.myCache.set<ITokenModel>(`${EnumCacheKey.RefreshToken}-${userId}`, refreshToken)
      res.status(200).json(this.successResponse({
        userName,
        userId,
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 刷新token
   * @interface /api/admin/user/v1/refresh-token
   * @method POST
   * @category user
   * @param {String} userName 用户名，不能为空
   * @param {String} password 密码，不能为空
   */
  refreshToken: RequestHandler<{}, IBaseResult<IResponseRefreshToken>, IBodyRefreshToken> = async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      const userId = await this.checkRefreshToken(refreshToken)
      const accessToken = this.getAccessToken(userId)
      res.status(200).json(this.successResponse({
        accessToken: accessToken.token,
        expiresIn: accessToken.expiresIn
      }))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 生成token
   * @param {Number} id 用户id
   * @returns {ITokenModel} token与到期时间
   */
  private getAccessToken = (id: number): ITokenModel => {
    const { accessTokenExp } = this.$yshop
    const accessExp = this.$yshop.dayjs().add(accessTokenExp, 's').unix()
    return {
      token: this.$yshop.initAccessToken({
        userId: id,
        exp: accessExp
      }),
      expiresIn: accessExp
    }
  }

  /**
   * 生成刷新token
   * @param {Number} id 用户id
   * @returns {ITokenModel} token与到期时间
   */
  private getRefreshToken = (id: number): ITokenModel => {
    const { refreshTokenExp } = this.$yshop
    const refreshExp = this.$yshop.dayjs().add(refreshTokenExp, 's').unix()
    return {
      token: this.$yshop.initRefreshToken({
        userId: id,
        exp: refreshExp
      }),
      expiresIn: refreshExp
    }
  }

  /**
   * 检查注册参数
   */
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
    return {
      userName,
      password,
      phone: phone || ''
    }
  }

  /**
   * 检查登录参数
   */
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

  /**
   * 检查刷新token
   */
  private checkRefreshToken = async (refreshToken: string) => {
    if (!this.$yshop.lodash.isString(refreshToken)) {
      throw this.createBadError('刷新凭证异常')
    }
    const decodeTokenJson = this.$yshop.decodedToken(refreshToken)
    const isString = this.$yshop.lodash.isString(decodeTokenJson)
    if (decodeTokenJson && !isString && decodeTokenJson.userId) {
      const refreshTokenCache = this.$yshop.myCache.get<ITokenModel>(`${EnumCacheKey.RefreshToken}-${decodeTokenJson.userId}`)
      if (refreshTokenCache) {
        if (!this.$yshop.dayjs().isBefore(this.$yshop.dayjs.unix(refreshTokenCache.expiresIn))) {
          throw this.createBadError('刷新凭证已过期')
        }
        return decodeTokenJson.userId
      } else {
        throw this.createBadError('刷新凭证异常')
      }
    } else {
      throw this.createBadError('刷新凭证异常')
    }
  }
}
