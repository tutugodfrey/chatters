import Joi from 'Joi'
import { UserInputError } from 'apollo-server-express'

import { startChat } from '../schemas'
import { Chat, User, Message } from '../models'
import { checkUserChat } from '../auth'

export default {
  Query: {
    chats: (root, args, context, info) => {
      const { req } = context
      const { id } = req.headers.user
      return Chat.find({ users: { $in: [id] } })
    },
    chat: async (root, args, context, info) => {
      const { chatId } = args
      const { req } = context
      const { id } = req.headers.user
      const userExist = checkUserChat(id, chatId)
      if (userExist) {
        return Chat.findById(chatId)
      }
    }
  },
  Mutation: {
    startChat: async (root, args, context, info) => {
      const { req } = context
      const { title, userIds } = args
      const { id } = req.headers.user
      await Joi.validate(args, startChat(id), { abortEarly: false })
      const idsFound = await User.where('_id').in(userIds).countDocuments()
      if (idsFound !== userIds.length) {
        throw new UserInputError('One or more User IDs are invalid.')
      }
      userIds.push(id)
      const chat = await Chat.create({ title, users: userIds })
      await User.updateMany({ _id: { '$in': userIds } }, {
        $push: { chats: chat }
      })
      return chat
    },
    updateChat: async (root, args, context, info) => {
      const { chatId, title, userIds } = args
      const { req } = context
      const { id } = req.headers.user
      const chat = await Chat.findById(chatId)
      const userExist = await checkUserChat(id, chatId)
      const users = chat.users
      if (userExist) {
        for (let id of userIds) {
          if (users.indexOf(id) === -1) {
            users.push(id)
          }
        }
        const query = {
          _id: chatId
        }
        const data = {
          title: title || chat.title,
          users: users
        }
        const options = {
          new: true
        }
        return Chat.findOneAndUpdate(query, data, options)
      }
    },
    deleteChat: async (root, args, context, info) => {
      const { chatId } = args
      const { req } = context
      const { id } = req.headers.user
      const userExist = await checkUserChat(id, chatId)
      if (userExist) {
        const result = await Chat.deleteOne({ _id: chatId })
        if (result.deletedCount === 1) {
          return 'Chat has been deleted'
        }
        return 'Chat could not be deleted'
      }
      return 'User or chat does not exist'
    },
    removeUser: async (root, args, context, info) => {
      const { userToDelete, chatId } = args
      const { req } = context
      const { id } = req.headers.user
      const userExist = await checkUserChat(id, chatId)
      if (userExist) {
        const chat = await Chat.findById(chatId)
        const { users } = chat
        const userPos = users.indexOf(userToDelete)
        users.splice(userPos, 1)
        const query = { _id: chatId }
        const data = { users: users }
        const options = { new: true }
        return Chat.findOneAndUpdate(query, data, options)
      }
    }
  },
  Chat: {
    messages: (chat, args, context, info) => {
      return Message.find({ chat: chat.id })
    },
    users: async (chat, args, context, info) => {
      return (await chat.populate('users').execPopulate()).users
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate('lastMessage').execPopulate()).lastMessage
    }
  }
}
