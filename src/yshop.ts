import { EnumEnv, IYShop, GetInstance, DelInstance } from '@/types/base'
import config from '@/config'
import dayjs from 'dayjs'
import lodash from 'lodash'
import jwt from 'jsonwebtoken'
import NodeCache from 'node-cache'

const env = process.env.SHOP_NODE_ENV as EnumEnv
const currentEnv = config[env]

const instances = new Map<any, any>()

const getInstance: GetInstance = (M, ...arg: any[]) => {
  if (!instances.get(M)) {
    instances.set(M, new M(...arg))
  }
  return instances.get(M)
}

const delInstance: DelInstance = (M) => {
  instances.delete(M)
}

const getServerTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

const initAccessToken = (info: string | Buffer | object) => {
  return jwt.sign(info, currentEnv.privateKey)
}

const initRefreshToken = (info: string | Buffer | object) => {
  return jwt.sign(info, currentEnv.refreshPrivateKey)
}

const decodedToken = (token: string) => {
  return jwt.decode(token)
}

const myCache = new NodeCache()

/**
 * token过期时间
 */
const accessTokenExp = 60 * 60
const refreshTokenExp = 60 * 60 * 48

const yshop: IYShop = {
  ...currentEnv,
  shopNodeEnv: env,
  getInstance,
  delInstance,
  dayjs,
  lodash,
  getServerTime,
  initAccessToken,
  initRefreshToken,
  decodedToken,
  myCache,
  accessTokenExp,
  refreshTokenExp
}

export default yshop
