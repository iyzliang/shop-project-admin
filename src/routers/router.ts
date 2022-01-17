import express from 'express'
import user from './user'
import spec from './spec'

const router = express.Router()

router.use('/user/v1', user)
router.use('/spec/v1', spec)

export default router
