import express from 'express'
import common from './common'

const router = express.Router()

router.use('/common/v1', common)

export default router
