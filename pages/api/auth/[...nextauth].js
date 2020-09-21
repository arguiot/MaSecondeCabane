import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  callbacks: {
    signIn: async (user, account, profile) => {
      if (account.provider === 'google' &&
          profile.email == "arguiot@gmail.com") {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    },
  }
}

export default (req, res) => NextAuth(req, res, options)