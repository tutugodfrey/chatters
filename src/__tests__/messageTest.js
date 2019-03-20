/* global before it describe */

import { app } from '../index'
import { clearDatabase } from '../helpers'

import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)
const { expect } = chai

let user1 = `mutation {signUp(name: "test1", email: "test1@gmail.com", username: "test1", password:"Aa!12345"){ id name email token }}`
let user2 = `mutation {signUp(name: "test2", email: "test2@gmail.com", username: "test2", password:"Aa!12345"){ id name email token }}`
let user3 = `mutation {signUp(name: "test3", email: "test3@gmail.com", username: "test3", password:"Aa!12345"){ id name email token }}`
const returnedUser1 = {}
const returnedUser2 = {}
const returnedUser3 = {}
const createdChat1 = {}
const createdMessage1 = {}
const createdMessage2 = {}
const updatedMessage1 = {}

describe('Message Test', () => {
  before(async () => {
    await clearDatabase()
  })

  describe('Add users to database', () => {
    it('should add user1 to db', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: user1 })
        .then(res => {
          Object.assign(returnedUser1, res.body.data.signUp)
        })
    })

    it('should add user1 to db', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: user2 })
        .then(res => {
          Object.assign(returnedUser2, res.body.data.signUp)
        })
    })

    it('should add user1 to db', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: user3 })
        .then(res => {
          Object.assign(returnedUser3, res.body.data.signUp)
        })
    })
  })

  describe('Add chat', () => {
    it('should create a chat', () => {
      const userId = returnedUser1.id
      const createChat1 = `mutation {startChat(title: "chat 1 title",  userIds:["${userId}"]){ id title users{id, email} }}`
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: createChat1 })
        .then(res => {
          const chat = res.body.data.startChat
          Object.assign(createdChat1, chat)
          expect(typeof chat).to.equal('object')
          expect(chat.title).to.equal('chat 1 title')
          expect(chat.users.length).to.equal(2)
        })
    })

    it('should create a chat', () => {
      const userId = returnedUser1.id
      const createChat1 = `mutation {startChat(title: "chat 1 title",  userIds:["${userId}"]){ id title users{id, email} }}`
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: createChat1 })
        .then(res => {
          const chat = res.body.data.startChat
          Object.assign(createdChat1, chat)
          expect(typeof chat).to.equal('object')
          expect(chat.title).to.equal('chat 1 title')
          expect(chat.users.length).to.equal(2)
        })
    })
  })

  describe('create method', () => {
    it('should not create a message if chatId does not exist', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { sendMessage(chatId: "5c8a6366c5db572f60d918b9", body: "Please come over"){ id, body }}` })
        .then(res => {
          const message = res.body.errors[0].message
          expect(message).to.equal('Chat does not exist.')
        })
    })

    it('should create a message', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { sendMessage(chatId: "${createdChat1.id}", body: "Please come over"){ id, body, chat{ id, title }}}` })
        .then(res => {
          const message = res.body.data.sendMessage
          Object.assign(createdMessage1, message)
          expect(message.body).to.equal('Please come over')
          expect(message.chat.id).to.equal(createdChat1.id)
        })
    })

    it('should create a message', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { sendMessage(chatId: "${createdChat1.id}", body: "Hello there"){ id, body, chat{ id, title }}}` })
        .then(res => {
          const message = res.body.data.sendMessage
          Object.assign(createdMessage2, message)
          expect(message.body).to.equal('Hello there')
          expect(message.chat.id).to.equal(createdChat1.id)
        })
    })
  })
  describe('update method', () => {
    it('should not update a message that does not exist', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { updateMessage(messageId: "5c8a6366c5db572f60d918b9", body: "Don't bother coming anymore"){ id, body, chat{ id, title }}}` })
        .then(res => {
          const message = res.body.errors[0].message
          expect(message).to.equal('Message does not exist.')
        })
    })

    it('should update a message', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { updateMessage(messageId: "${createdMessage1.id}", body: "Don't bother coming anymore"){ id, body, chat{ id, title }}}` })
        .then(res => {
          const message = res.body.data.updateMessage
          Object.assign(updatedMessage1, message)
          expect(message.body).to.equal('Don\'t bother coming anymore')
          expect(message.id).to.equal(createdMessage1.id)
          expect(message.chat.id).to.equal(createdChat1.id)
        })
    })
  })
  describe('get messages method', () => {
    it('should get all message for a chat', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `query { messages(chatId: "${createdChat1.id}"){ id, body, chat{ id, title }}}` })
        .then(res => {
          const messages = res.body.data.messages
          expect(messages.length).to.equal(2)
        })
    })
  })
  describe('get method', () => {
    it('should get a message by id', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `query { message(messageId: "${createdMessage1.id}"){id, body, chat{ id, title }, sender{ id, name }}}` })
        .then(res => {
          const message = res.body.data.message
          expect(message[0].id).to.equal(createdMessage1.id)
          expect(message[0].body).to.equal(updatedMessage1.body)
        })
    })
  })

  describe('delete message', () => {
    it('should delete a message with given id', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { deleteMessage(messageId: "5c8a6366c5db572f60d918b9")}` })
        .then(res => {
          const result = res.body.errors[0].message
          expect(result).to.equal('Message does not exist.')
        })
    })

    it('should delete a message with given id', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { deleteMessage(messageId: "${createdMessage2.id}")}` })
        .then(res => {
          const result = res.body.data.deleteMessage
          expect(result).to.equal('Message has be deleted')
        })
    })
  })
})
