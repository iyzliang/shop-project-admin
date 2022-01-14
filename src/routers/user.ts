import express from 'express'
import yshop from '@/yshop'
import UserController from '@/controllers/user'

const userController = yshop.getInstance(UserController)

const user = express.Router()

user.post('/register', userController.register)
user.post('/login', userController.login)
user.post('/refresh-token', userController.refreshToken)

export default user
