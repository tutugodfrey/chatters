import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  IN_PROD,
  DATABASE
} from './config'
import schemaDirectives from './directives'

mongoose.Promise = global.Promise
mongoose.connect(DATABASE, {
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

server.applyMiddleware({ app, cors: true })

export {
  app,
  server
}
