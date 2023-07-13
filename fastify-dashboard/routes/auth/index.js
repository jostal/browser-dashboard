'use strict'
const AuthService = require('../../services/auth.service.js')

module.exports = async function (fastify, opts) {
  const authService = new AuthService()

  fastify.post('/register', async function (request, reply) {
    let res = {
      statusCode: 400,
      message: 'Error registering'
    }  

    res = await authService.register(request.body)

    reply
      .code(res.statusCode)
      .send(res.message)
  })
}
