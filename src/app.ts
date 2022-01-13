import yshop from '@/yshop'
import express from 'express'
import cors from 'cors'
import shopLog from '@/app/log'
import shopAccess from '@/app/access'
import router from '@/routers/router'
import { notFound, errorResponse } from '@/app/errorHandler'

const app = express()

yshop.app = app

app.use(cors())
app.use(shopLog)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', shopAccess)
app.use('/api/admin', router)
app.use(notFound)
app.use(errorResponse)

app.listen(yshop.serverPort, () => {
  console.log(`==> ${yshop.getServerTime()}服务启动`)
})
