const User = require('../models/User')

class AuthService {
  returnMessage = (code, message) => {
    return {
      statusCode: code,
      message: message
    }
  }

  async register(userInfo) {
    const user = new User()
    const result = await user.register(userInfo)
    return this.returnMessage(result.statusCode, result.message)
  }
}

module.exports = AuthService
