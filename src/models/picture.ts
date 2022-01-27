import { IPictureSchema } from '@/types'
import BaseModel, { GetSchema } from './base'

export default class PictureModel extends BaseModel<IPictureSchema> {
  getName () {
    return 'picture'
  }

  getSchema (): GetSchema<IPictureSchema> {
    return {
      id: Number,
      name: String,
      extension: String,
      mimetype: String,
      addTime: String,
      upTime: String,
      createUserId: Number
    }
  }

  save (data: IPictureSchema) {
    const user = new this.MyModel(data)
    return user.save()
  }
}
