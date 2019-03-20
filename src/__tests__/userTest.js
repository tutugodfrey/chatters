/* global before it,  describe */
import { gql } from 'apollo-server-express'
import { app } from '../index'
import { clearDatabase } from '../helpers'
import User from '../models/user'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASS, ADMIN_EMAIL } from '../config'

chai.use(chaiHttp)
const { expect } = chai

let user1 = `mutation {signUp(name: "test1", email: "test1@gmail.com", username: "test1", password:"Aa!12345"){ id name email token }}`
let user2 = `mutation {signUp(name: "test2", email: "test2@gmail.com", username: "test2", password:"Aa!12345"){ id name email token }}`
let user3 = `mutation {signUp(name: "test3", email: "test3@gmail.com", username: "test3", password:"Aa!12345"){ id name email token }}`
const signin = 'mutation { signIn(email: "test3@gmail.com", password: "Aa!12345"){id, name, email, token } }'
const signinAsAdmin = `mutation { signIn(email: "${ADMIN_EMAIL}", password: "${ADMIN_PASS}"){id, name, email, token } }`
const users = '{ users{ id, name, email } }'
const signInUser = `{ signedInUser{ id name, email }}`
const messages = '{ messages(chatId: "5c88ec7c6848ae315e0afd0a"){ id, body, chat{id, title } } }'
const message = '{ message(messageId: "5c88ec7c6848ae315e0afd0a"){ id, body, chat{id, title } } }'
const chats = '{ chats{ id, title}}'
const chat = ' { chat(chatId: ""){ id, title }}'
const adminUser = {}
const normalUser = {}
const returnedUser3 = {}

const admin = new User({
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  username: ADMIN_USERNAME,
  password: ADMIN_PASS,
  isAdmin: true
})
const createAdmin = async () => {
  const result = await admin.save()
  return result
}

describe('Chat API', () => {
  before(async () => {
    await clearDatabase()
    const admin = await createAdmin()
    await Object.assign(adminUser, admin)
  })

  describe('Pre signup/signin', () => {
    it('it should confirm the server is runnng', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ 'query': 'query { status }' })
        .then(res => {
          expect(res.statusCode).to.equal(200)
        })
    })

    it('it should not allow access for unauthenticated users', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query: users })
        .then(res => {
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })

    it('it should allow unauthenticated user to view signInUser', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: signInUser })
        .then(res => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })

    it('should not allow unauthenticated user to view messages', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: messages })
        .then(res => {
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })

    it('should not allow unauthenticated user to view messages', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: message })
        .then(res => {
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })

    it('should not allow unauthenticated user to view chats', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: chats })
        .then(res => {
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })

    it('should not allow unauthenticated user to view a chat', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: chat })
        .then(res => {
          expect(res.body.errors[0].message).to.equal('Please provide a token.')
        })
    })
  })

  describe('signup', () => {
    it('it should create user record', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: user1
        })
        .then(res => {
          const user = res.body.data.signUp
          expect(res.statusCode).to.equal(200)
          expect(user.name).to.equal('test1')
        })
    })

    it('it should create user record', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: user2
        })
        .then(res => {
          const user = res.body.data.signUp
          expect(res.statusCode).to.equal(200)
          expect(user.name).to.equal('test2')
        })
    })

    it('it should create user record', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          query: user3
        })
        .then(res => {
          const user = res.body.data.signUp
          Object.assign(returnedUser3, user)
          expect(res.statusCode).to.equal(200)
          expect(user.name).to.equal('test3')
        })
    })
  })

  describe('signin', () => {
    it('it should signin', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query: signin })
        .then(res => {
          const user = res.body.data.signIn
          Object.assign(normalUser, user)
          expect(res.statusCode).to.equal(200)
          expect(typeof user.token).to.equal('string')
        })
    })

    it('it should signin', () => {
      return chai.request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query: signinAsAdmin })
        .then(res => {
          const user = res.body.data.signIn
          Object.assign(adminUser, user)
          expect(res.statusCode).to.equal(200)
          expect(typeof user.token).to.equal('string')
          expect(user.email).to.equal(ADMIN_EMAIL)
        })
    })
  })

  describe('deleteUser', () => {
    it('should delete a user with admin privilege', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', adminUser.token)
        .send({ query: `mutation { deleteUser(id: "${returnedUser3.id}")}` })
        .then(res => {
          const result = res.body.data.deleteUser
          expect(result).to.equal('User successfully deleted')
        })
    })
  })
})
