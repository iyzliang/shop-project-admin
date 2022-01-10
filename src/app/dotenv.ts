import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.SHOP_NODE_ENV}`
})

export default {
  serverPort: process.env.serverPort
}
