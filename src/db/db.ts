import mongoose from 'mongoose'

const { SHOP_DB_USER, SHOP_DB_PWD, SHOP_DB_HOST, SHOP_DB_PORT, SHOP_DB_NAME } = process.env

const db = mongoose.createConnection(`mongodb://${SHOP_DB_USER}:${SHOP_DB_PWD}@${SHOP_DB_HOST}:${SHOP_DB_PORT}/${SHOP_DB_NAME}`, {
  authSource: 'admin'
})

db.on('err', console.error.bind(console, '连接错误:'))
db.once('open', () => {
  console.log('数据库连接成功')
})

export default db
