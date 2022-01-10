import morgan from 'morgan'
import dayjs from 'dayjs'
import fs from 'fs'

const accessLogStream = fs.createWriteStream(process.env.logPath || '', { flags: 'a' })
morgan.token('serverTime', () => dayjs().format('YYYY-MM-DD HH:mm:ss'))

morgan.format('shopLog', ':remote-addr - :remote-user [:serverTime]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

export default morgan('shopLog', {
  stream: accessLogStream
})
