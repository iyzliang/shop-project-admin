import express from 'express'
import user from './user'
import spec from './spec'
import common from './common'

const router = express.Router()

router.use('/user/v1', user)
router.use('/spec/v1', spec)
router.use('/common/v1', common)

export default router
