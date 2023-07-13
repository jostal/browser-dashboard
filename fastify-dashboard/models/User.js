const { createClient } = require('@supabase/supabase-js')

class User {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }

  async register(userInfo) {
    if (userInfo.useThirdParty) {
      let { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: userInfo.thirdPartyProvider
      }) 
      return {
        statusCode: data ? 200 : 500,
        message: data ? data : error
      }
    } else {
      let { data, error } = await this.supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password
      })
      return {
        statusCode: data.user !== null ? 200 : 500,
        message: data.user !== null ? "User created" : "User already exists"
      }
    }
  }
}

module.exports = User
