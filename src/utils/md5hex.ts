const crypto = require('crypto')

export default (code: string) => {
  return crypto.createHash('md5').update(code).digest('hex')
}
