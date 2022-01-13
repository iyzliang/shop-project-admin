import { IId, EnumIdModel } from '@/types'
import BaseModel, { GetSchema } from './base'

export default class IdModel extends BaseModel<IId> {
  private initNumber: number = 1
  private stepNumber: number = 1

  getName () {
    return 'id'
  }

  getSchema (): GetSchema<IId> {
    return {
      model: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true
      }
    }
  }

  private save (data: IId) {
    const user = new this.MyModel(data)
    return user.save()
  }

  private getCountByModel (model: EnumIdModel) {
    return this.MyModel.findOne({
      model
    }).exec()
  }

  async getNextModelCount (model: EnumIdModel) {
    const idItem = await this.getCountByModel(model)
    if (idItem) {
      return await this.save({
        model,
        count: idItem.count + this.stepNumber
      })
    } else {
      return await this.save({
        model,
        count: this.initNumber
      })
    }
  }
}
