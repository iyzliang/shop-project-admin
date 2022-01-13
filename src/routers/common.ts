import express from 'express'
import yshop from '@/yshop'
import UserController from '@/controllers/user'

const userController = yshop.getInstance(UserController)

const common = express.Router()

common.post('/register', userController.register)

export default common
