import { IUserSchema } from '@/types'
import BaseModel, { GetSchema } from './base'

export default class IdModel extends BaseModel<IUserSchema> {
  getName () {
    return 'user'
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
      upTime: String
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
}
