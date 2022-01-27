import { RequestHandler } from 'express'
import SpecModel from '@/models/spec'
import {
  ISpecData,
  IBaseResult,
  IPostBodySpec,
  EnumIdModel,
  IGetParamsSpec,
  IResultList,
  IPutParamsSpec,
  IPutBodySpec
} from '@/types'
import { checkSpecLabel, checkSpecUnit } from '@/utils/check'
import BaseController from './base'

export default class SpecController extends BaseController {
  Model: SpecModel
  constructor () {
    super()
    this.Model = this.$yshop.getInstance<SpecModel>(SpecModel)
  }

  /**
   * 创建规格
   * @interface /api/admin/spec/v1/specifications
   * @method POST
   * @category spec
   * @param {String} label 规格名称，不能为空
   * @param {String} unit 单位，不能为空
   * @param {Number} sort 排序，默认1
   * @param {Boolean} display 是否展示，默认展示
   */
  public postSpec: RequestHandler<{}, IBaseResult<ISpecData>, IPostBodySpec> = async (req, res, next) => {
    try {
      const checkData = await this.checkPostSpec(req.body)
      const specId = await this.$IdModel.getNextModelCount(EnumIdModel.SpecId)
      const userId = this.getUserId(req)
      const specSchema = {
        ...checkData,
        specId,
        addTime: this.$yshop.getServerTime(),
        upTime: this.$yshop.getServerTime(),
        createUserId: userId
      }
      this.Model.save(specSchema)
      res.status(200).json(this.successResponse({
        ...checkData,
        specId: specSchema.specId,
        upTime: specSchema.upTime
      }))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取规格列表
   * @interface /api/admin/spec/v1/specifications
   * @method GET
   * @category spec
   * @param {Number} page 页数，默认1
   * @param {Number} perPage 每页数量，默认10
   * @param {String} label 筛选规格名称
   * @param {Number} specId 筛选规格ID
   */
  public getSpec: RequestHandler<IGetParamsSpec, IBaseResult<IResultList<ISpecData>>, {}> = async (req, res, next) => {
    try {
      const { page = 1, perPage = 10, label, specId } = req.params
      const filter: Partial<IGetParamsSpec> = {}
      label && (filter.label = label)
      specId && (filter.specId = specId)
      const totalNumber = await this.Model.listCount(filter)
      const totalPage = Math.ceil(totalNumber / perPage)
      const data = await this.Model.listWithPaging(page, perPage, filter)
      res.status(200).json(this.successResponse({
        page,
        perPage,
        totalNumber,
        totalPage,
        data
      }))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 修改规格
   * @interface /api/admin/spec/v1/specifications/{specId}
   * @method PUT
   * @category spec
   * @param {String} label 规格名称
   * @param {String} unit 单位
   * @param {Number} sort 排序
   * @param {Boolean} display 是否展示
   */
  public putSpec: RequestHandler<IPutParamsSpec, IBaseResult<ISpecData>, IPutBodySpec> = async (req, res, next) => {
    try {
      const { specId, ...updateDoc } = await this.checkPutSpec(req.params, req.body)
      const specDocumet = await this.Model.updateSpecById(specId, {
        ...updateDoc,
        upTime: this.$yshop.getServerTime()
      })
      res.status(200).json(this.successResponse(specDocumet!))
    } catch (error) {
      next(error)
    }
  }

  /**
   * 检查创建规格参数
   */
  private checkPostSpec = async (body: IPostBodySpec) => {
    const { label, unit, sort = 1, display = true } = body
    if (!checkSpecLabel(label)) {
      throw this.createBadError('规格名称格式为1-10位字符')
    }
    if (!checkSpecUnit(unit)) {
      throw this.createBadError('单位名称格式为1-5位字符')
    }
    const specDocument = await this.Model.findSpecByLabel(label)
    if (specDocument) {
      throw this.createBadError('规格名称重复')
    }
    return {
      label,
      unit,
      sort: sort > 0 ? sort : 1,
      display: !!display
    }
  }

  /**
   * 检查修改规格参数
   */
  private checkPutSpec = async (params: IPutParamsSpec, body: IPutBodySpec) => {
    const { specId } = params
    const { label, unit, sort, display } = body
    const updateDoc: IPutBodySpec = {}
    if (!specId) {
      throw this.createBadError('规格id不能为空')
    }
    const specDocument = await this.Model.findSpecById(parseInt(specId))
    if (!specDocument) {
      throw this.createBadError('未找到对应规格')
    }
    if (label && !checkSpecLabel(label)) {
      throw this.createBadError('规格名称格式为1-10位字符')
    } else {
      updateDoc.label = label
    }
    if (unit && !checkSpecUnit(unit)) {
      throw this.createBadError('单位名称格式为1-5位字符')
    } else {
      updateDoc.unit = unit
    }
    if (sort && this.$yshop.lodash.isNumber(sort) && sort > 0) {
      updateDoc.sort = parseInt(`${sort}`)
    }
    if (this.$yshop.lodash.isBoolean(display)) {
      updateDoc.display = display
    }
    return {
      ...updateDoc,
      specId: specDocument.specId
    }
  }
}
