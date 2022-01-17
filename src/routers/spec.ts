import express from 'express'
import yshop from '@/yshop'
import SpecController from '@/controllers/spec'

const specController = yshop.getInstance(SpecController)

const spec = express.Router()

spec.post('/specifications', specController.postSpec)
spec.get('/specifications', specController.getSpec)
spec.put('/specifications/:specId', specController.putSpec)

export default spec
