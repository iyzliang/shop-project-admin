import morgan from 'morgan'
import fs from 'fs'
import yshop from '@/yshop'

const accessLogStream = fs.createWriteStream(yshop.logPath, { flags: 'a' })
morgan.token('serverTime', () => yshop.dayjs().format('YYYY-MM-DD HH:mm:ss'))

morgan.format('shopLog', ':remote-addr - :remote-user [:serverTime]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

export default morgan('shopLog', {
  stream: accessLogStream
})
