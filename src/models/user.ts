import { IUserSchema, IRefreshToken } from '@/types'
import BaseModel, { GetSchema } from './base'

export default class IdModel extends BaseModel<IUserSchema> {
  getName () {
    return 'User'
  }

  getSchema (): GetSchema<IUserSchema> {
    return {
      userId: {
        type: Number,
        required: true,
        index: true
      },
      userName: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      phone: String,
      addTime: String,
      upTime: String,
      refreshToken: {
        token: {
          type: String,
          default: ''
        },
        expiresIn: Number
      }
    }
  }

  save (data: IUserSchema) {
    const user = new this.MyModel(data)
    return user.save()
  }

  findUserByName (name: string) {
    return this.MyModel.findOne({
      userName: name
    }).exec()
  }

  updateUserToken (userId: number, refreshToken: IRefreshToken) {
    return this.MyModel.updateOne({ userId }, {
      refreshToken
    }).exec()
  }

  findUserById (userId: number) {
    return this.MyModel.findOne({ userId }).exec()
  }
}
