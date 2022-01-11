import expressJwt from 'express-jwt'
import unless from 'express-unless'

const unlessPath: unless.pathFilter[] = []

export default expressJwt({
  secret: process.env.privateKey || '',
  algorithms: ['HS256']
}).unless({
  path: unlessPath
})
