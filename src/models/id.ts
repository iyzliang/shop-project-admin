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

  private updataCountByModel (model: EnumIdModel, count: number) {
    return this.MyModel.updateOne({
      model
    }, { count }).exec()
  }

  private getCountByModel (model: EnumIdModel) {
    return this.MyModel.findOne({
      model
    }).exec()
  }

  async getNextModelCount (model: EnumIdModel) {
    const idItem = await this.getCountByModel(model)
    if (idItem) {
      const count = idItem.count + this.stepNumber
      await this.updataCountByModel(model, count)
      return count
    } else {
      await this.save({
        model,
        count: this.initNumber
      })
      return this.initNumber
    }
  }
}
