import express from 'express'
import yshop from '@/yshop'
import CommonController from '@/controllers/common'

const commonController = yshop.getInstance(CommonController)

const common = express.Router()

common.post('/pictures', commonController.postPictures)

export default common
