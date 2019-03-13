import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  APP_PORT,
  IN_PROD,
  DATABASE_URL
} from './config'
import schemaDirectives from './directives';

(async () => {
  try {
    mongoose.Promise = global.Promise
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true
    })
    const app = express()
    app.disable('x-powered-by')
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: IN_PROD ? false : {
        settings: {
          'request.credentials': 'include'
        }
      },
      context: ({ req, res }) => ({ req, res })
    })

    server.applyMiddleware({ app, cors: false })
    app.listen({ port: APP_PORT }, () => {
      console.log(`View app on http://localhost:${APP_PORT}${server.graphqlPath}`)
    })
  } catch (err) {
    console.log(err)
  }
})()
