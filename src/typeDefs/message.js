import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    messages(chatId: ID!): [Message!] @auth
    message(messageId: ID!): [Message!] @auth
  }
  extend type Mutation {
    sendMessage(body: String!, chatId: ID!): Message @auth
    updateMessage(messageId: ID!, body: String): Message @auth
    deleteMessage(messageId: ID!): String @auth
  }
  type Message {
    id: ID!
    body: String!
    sender: User
    chat: Chat!
    createdAt: String!
    updatedAt: String!
  }
`
