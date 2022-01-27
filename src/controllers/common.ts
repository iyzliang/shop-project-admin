import { IncomingMessage } from 'http'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import formidable, { Fields, Files, File } from 'formidable'
import { IBaseResult, EnumCacheKey, EnumIdModel } from '@/types'
import BaseController from './base'
import PictureModel from '../models/picture'
import path from 'path'
import qiniu from 'qiniu'

const uploadDir = path.join(__dirname, '../../temp')
const maxFileSize = 5

export default class CommonController extends BaseController {
  MyPictureModel: PictureModel
  constructor () {
    super()
    this.MyPictureModel = this.$yshop.getInstance<PictureModel>(PictureModel)
  }

  public postPictures: RequestHandler<{}, IBaseResult<null>, IncomingMessage> = (req, res, next) => {
    try {
      const form = new formidable.IncomingForm({
        uploadDir,
        maxFileSize: 1024 * 1024 * maxFileSize,
        keepExtensions: true
      })
      form.parse(req, (error: any, fields: Fields, files: Files) => {
        if (error) {
          next(this.createBadError(`上传资源超出${maxFileSize}M限制`))
          return
        }
        this.formParse(files, req, res, next)
      })
    } catch (error) {
      next(error)
    }
  }

  private formParse = (files: Files, req: Request, res: Response, next: NextFunction) => {
    const pictureKeys = Object.keys(files)
    let count = pictureKeys.length
    pictureKeys.forEach((key: string) => {
      const file = files[key] as File
      const config = this.getQiniuConfig()
      const uploadToken = this.getUploadToken()
      const formUploader = new qiniu.form_up.FormUploader(config)
      const putExtra = new qiniu.form_up.PutExtra()
      formUploader.putFile(uploadToken, file.newFilename, file.filepath, putExtra, async (error, body, info) => {
        if (error) {
          next(this.createBadError('上传资源时发生错误，请稍后重试'))
          return
        }
        if (info.statusCode === 200) {
          const pictureId = await this.$IdModel.getNextModelCount(EnumIdModel.PictureId)
          const nameAndExtension = file.newFilename.split('.') as [string, string]
          const userId = this.getUserId(req)
          await this.MyPictureModel.save({
            id: pictureId,
            name: nameAndExtension[0],
            extension: nameAndExtension[1],
            mimetype: file.mimetype,
            addTime: this.$yshop.getServerTime(),
            upTime: this.$yshop.getServerTime(),
            createUserId: userId
          })
          count--
          if (count === 0) {
            res.status(200).json(this.successResponse(null))
          }
        } else {
          next(this.createBadError('上传资源时发生错误，请稍后重试'))
        }
      })
    })
  }

  private getUploadToken = (): string => {
    const uploadToken: string | undefined = this.$yshop.myCache.get(EnumCacheKey.UploadToken)
    if (uploadToken) {
      return uploadToken
    } else {
      const mac = new qiniu.auth.digest.Mac(this.$yshop.qAccessKey, this.$yshop.qSecretKey)
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: 'iyzliang-image',
        expires: this.$yshop.accessTokenExp
      })
      const uploadToken = putPolicy.uploadToken(mac)
      this.$yshop.myCache.set<string>(EnumCacheKey.UploadToken, uploadToken, this.$yshop.accessTokenExp)
      return uploadToken
    }
  }

  private getQiniuConfig = () => {
    return new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z1,
      useHttpsDomain: true,
      useCdnDomain: true
    })
  }
}
