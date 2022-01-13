import yshop from '@/yshop'
import expressJwt from 'express-jwt'
import unless from 'express-unless'

const unlessPath: unless.pathFilter[] = [
  '/api/admin/common/v1/register'
]

export default expressJwt({
  secret: yshop.privateKey,
  algorithms: ['HS256']
}).unless({
  path: unlessPath
})
