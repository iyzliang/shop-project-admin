import express from 'express'
import user from './user'

const router = express.Router()

router.use('/user/v1', user)

export default router
