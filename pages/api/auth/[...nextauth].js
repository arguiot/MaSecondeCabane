import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const authorized = [
  "elodiepacault@hotmail.com", // CEO
  "arguiot@gmail.com" // Admin
]

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
          authorized.includes(profile.email)) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    },
  }
}

export default (req, res) => NextAuth(req, res, options)