/* global before it before describe */

import { app } from '../index'
import { clearDatabase } from '../helpers'

import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)
const { expect } = chai

let user1 = `mutation {signUp(name: "test1", email: "test1@gmail.com", username: "test1", password:"Aa!12345"){ id name email token }}`
let user2 = `mutation {signUp(name: "test2", email: "test2@gmail.com", username: "test2", password:"Aa!12345"){ id name email token }}`
let user3 = `mutation {signUp(name: "test3", email: "test3@gmail.com", username: "test3", password:"Aa!12345"){ id name email token }}`
let user4 = `mutation {signUp(name: "test4", email: "test4@gmail.com", username: "test4", password:"Aa!12345"){ id name email token }}`
const returnedUser1 = {}
const returnedUser2 = {}
const returnedUser3 = {}
const returnedUser4 = {}
const createdChat1 = {}
const createdChat2 = {}

describe('Chat test', () => {
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

    it('should add user1 to db', () => {
      return chai.request(app)
        .post('/graphql')
        .send({ query: user4 })
        .then(res => {
          Object.assign(returnedUser4, res.body.data.signUp)
        })
    })
  })

  describe('Start chats', () => {
    it('should not create a chat if userids are invalid', () => {
      const createChat1 = `mutation {startChat(title: "chat 1 title",  userIds:["5c8a6366c5db572f60d918b9"]){ id title users{id, email} }}`
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: createChat1 })
        .then(res => {
          const chat = res.body.errors[0].message
          expect(chat).to.equal('One or more User IDs are invalid.')
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
    it('should autofill the title of chat', () => {
      const userId = returnedUser1.id
      const createChat2 = `mutation {startChat( userIds:["${userId}"]){ id title users{id, email} }}`
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: createChat2 })
        .then(res => {
          const chat = res.body.data.startChat
          Object.assign(createdChat2, chat)
          expect(typeof chat).to.equal('object')
          expect(chat.title).to.equal('test1, test3')
          expect(chat.users.length).to.equal(2)
        })
    })
  })

  describe('Update chat', () => {
    it('should not update the chat if user does not belong to it', () => {
      const userId = returnedUser2.id
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser4.token)
        .send({ query: `mutation { updateChat(chatId: "${createdChat1.id}", title: "chat 1 title updated", userIds: ["${userId}"]){ id, title, users{ id, email }}}` })
        .then(res => {
          const chat = res.body.data.updateChat
          expect(chat).to.equal(null)
        })
    })

    it('should update the chat', () => {
      const userId = returnedUser2.id
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { updateChat(chatId: "${createdChat1.id}", title: "chat 1 title updated", userIds: ["${userId}"]){ id, title, users{ id, email }}}` })
        .then(res => {
          const chat = res.body.data.updateChat
          expect(chat.title).to.equal('chat 1 title updated')
          expect(chat.id).to.equal(createdChat1.id)
        })
    })
  })

  describe('Get chats', () => {
    it('should not get chat if user does not below to the chat', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser4.token)
        .send({ query: `query { chats{ id, title }}` })
        .then(res => {
          const chat = res.body.data.chats
          expect(chat.length).to.equal(0)
        })
    })

    it('should get all chats', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `query { chats{id, title, users{ id, email }}}` })
        .then(res => {
          const chats = res.body.data.chats
          expect(chats.length).to.equal(2)
          expect(chats[0]).to.have.property('title', 'chat 1 title updated')
          expect()
        })
    })
  })

  describe('Get chat by Id', () => {
    it('should not get chat if user does not below to the chat', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser4.token)
        .send({ query: `query { chat(chatId: "${createdChat2.id}"){ id, title }}` })
        .then(res => {
          const chat = res.body.data.chat
          expect(chat).to.equal(null)
        })
    })

    it('should get chat by id', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `query { chat(chatId: "${createdChat2.id}"){ id, title, messages{ id, body }, users{ id, name }, lastMessage{ id, body }}}` })
        .then(res => {
          const chat = res.body.data.chat
          expect(chat.id).to.equal(createdChat2.id)
          expect(chat.title).to.equal('test1, test3')
        })
    })
  })

  describe('RemoveUser', () => {
    it('should remove user from chat', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { removeUser(chatId: "${createdChat1.id}", userToDelete: "${returnedUser2.id}"){ id, title, users{ id, name }}}` })
        .then(res => {
          const chat = res.body.data.removeUser
          expect(chat.users.length).to.equal(2)
        })
    })
  })

  describe('deleteChat', () => {
    it('should not delete a chat if user/chat does not exist', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { deleteChat(chatId: "5c8a6366c5db572f60d918b9")}` })
        .then(res => {
          const result = res.body.data.deleteChat
          expect(result).to.equal('User or chat does not exist')
        })
    })

    it('should delete a chat', () => {
      return chai.request(app)
        .post('/graphql')
        .set('token', returnedUser3.token)
        .send({ query: `mutation { deleteChat(chatId: "${createdChat2.id}")}` })
        .then(res => {
          const result = res.body.data.deleteChat
          expect(result).to.equal('Chat has been deleted')
        })
    })
  })
})
