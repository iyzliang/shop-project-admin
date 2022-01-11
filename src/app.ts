import env from '@/app/dotenv'
import express from 'express'
import cors from 'cors'
import shopLog from '@/app/log'
import shopAccess from '@/app/access'
import dayjs from 'dayjs'
import router from '@/routers/router'
import { notFound, errorResponse } from '@/app/errorHandler'

const app = express()

app.use(cors())
app.use(shopLog)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', shopAccess)
app.use('/api/admin', router)
app.use(notFound)
app.use(errorResponse)

app.listen(env.serverPort, () => {
  console.log(`==> ${dayjs().format('YYYY-MM-DD HH:mm:ss')}服务启动`)
})
