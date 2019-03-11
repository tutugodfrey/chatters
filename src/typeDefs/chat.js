import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    chats: [Chat!]! @auth
    chat(chatId: ID!): Chat @auth
  }
  extend type Mutation {
    startChat(title: String, userIds: [ID!]!): Chat @auth
    updateChat(chatId: ID!, title: String, userIds: [ID]): Chat @auth
    deleteChat(chatId: ID!): String @auth
    removeUser(chatId: ID!, userToDelete: ID!): Chat @auth
  },

  type Chat {
    id: ID!
    title: String!
    users: [User!]!
    messages: [Message!]!
    lastMessage: Message
    createdAt: String!
    updatedAt: String!
  }
`
