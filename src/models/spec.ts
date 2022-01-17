import { ISpecSchema } from '@/types'
import BaseModel, { GetSchema } from './base'

export default class SpecModel extends BaseModel<ISpecSchema> {
  getName () {
    return 'spec'
  }

  getSchema (): GetSchema<ISpecSchema> {
    return {
      specId: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      sort: Number,
      display: Boolean,
      unit: {
        type: String,
        required: true
      },
      addTime: String,
      upTime: String,
      createUserId: Number
    }
  }

  public save (data: ISpecSchema) {
    const spec = new this.MyModel(data)
    return spec.save()
  }

  public listCount (filter: object) {
    return this.MyModel.countDocuments(filter).exec()
  }

  public listWithPaging (page: number, limit: number, filter: object) {
    return this.MyModel
      .find(filter)
      .sort({ specId: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('specId label sort display unit upTime -_id')
      .exec()
  }

  public findSpecByLabel (label: string) {
    return this.MyModel
      .findOne({
        label
      })
      .exec()
  }

  public findSpecById (id: number) {
    return this.MyModel
      .findOne({
        specId: id
      })
      .exec()
  }

  public updateSpecById (id: number, update: Partial<ISpecSchema>) {
    return this.MyModel
      .findOneAndUpdate({
        specId: id
      }, update, {
        returnDocument: 'after'
      })
      .select('specId label sort display unit upTime -_id')
      .exec()
  }
}
