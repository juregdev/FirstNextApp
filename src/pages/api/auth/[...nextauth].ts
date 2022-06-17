
import { query as q } from 'faunadb'
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      }
    }),
  ],
  callbacks: {
    async signIn(data) {
      const { user } = data
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('data_by_email'),
                  q.Casefold(data.user.email!)
                )
              )
            ), q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(q.Match(
              q.Index('data_by_email'), q.Casefold(data.user.email!)
            ))
          )
        )
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    }

  },
  secret: process.env.SECRET
}
)