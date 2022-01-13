import { Schema, SchemaDefinition, SchemaDefinitionType, Model } from 'mongoose'
import db from '@/utils/db'

export type GetSchema<T> = SchemaDefinition<SchemaDefinitionType<T>>

export default abstract class BaseModel<T> {
  public name: string
  public MySchema: Schema<T>
  public MyModel: Model<T>
  constructor () {
    this.name = this.getName()
    this.MySchema = new Schema<T>(this.getSchema())
    this.MyModel = db.model(this.name, this.MySchema)
  }

  abstract getName(): string
  abstract getSchema(): GetSchema<T>
}
