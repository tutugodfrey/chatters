import { gql } from 'apollo-server-express'

export default gql`
extend type Query {
  signedInUser: User @auth
  user(id: ID!): User @auth
  users: [User!]! @auth
}

extend type Mutation {
  signUp(email: String!, username: String!, name: String! password: String!): User
  signIn(email: String!, password: String!): User
  deleteUser(id: ID!): String @auth
}

type User {
  id: ID!
  email: String!
  username: String!
  name: String!
  chats: [Chat]
  createdAt: String!
  isAdmin: Boolean
  token: String
}
`
