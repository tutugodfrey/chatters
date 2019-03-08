import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import connectRedis from 'connect-redis'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  APP_PORT,
  IN_PROD,
  DATABASE_URL,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} from './config'

(async () => {
  try {
    mongoose.Promise = global.Promise
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true
    })
    const app = express()
    const RedisStore = connectRedis(session)
    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      pass: REDIS_PASSWORD
    })
    app.use(session({
      store,
      name: SESS_NAME,
      secret: SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
      }
    }))

    app.disable('x-powered-by')
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cors: false,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })

    server.applyMiddleware({ app })
    app.listen({ port: APP_PORT }, () => {
      console.log(`View app on http://localhost:${APP_PORT}${server.graphqlPath}`)
    })
  } catch (err) {
    console.log(err)
  }
})()
