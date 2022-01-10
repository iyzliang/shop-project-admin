import express from 'express'
import { postRegister } from './register'

const common = express.Router()

common.post('/register', postRegister)

export default common
