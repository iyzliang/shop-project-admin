import mongoose from 'mongoose'
import yshop from '@/yshop'

const { shopDBUser, shopDBPwd, shopDBHost, shopDBPort, shopDBName } = yshop

const db = mongoose.createConnection(`mongodb://${shopDBUser}:${shopDBPwd}@${shopDBHost}:${shopDBPort}/${shopDBName}`, {
  authSource: 'admin'
})

db.on('err', console.error.bind(console, '连接错误:'))
db.once('open', () => {
  console.log('数据库连接成功')
})

export default db
