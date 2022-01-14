import yshop from '@/yshop'
import expressJwt from 'express-jwt'
import unless from 'express-unless'

const unlessPath: unless.pathFilter[] = [
  '/api/admin/user/v1/register',
  '/api/admin/user/v1/login',
  '/api/admin/user/v1/refresh-token'
]

export default expressJwt({
  secret: yshop.privateKey,
  algorithms: ['HS256']
}).unless({
  path: unlessPath
})
