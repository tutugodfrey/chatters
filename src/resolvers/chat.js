import Joi from 'Joi'
import { startChat } from '../schemas'
import { Chat, User, Message } from '../models';
import { UserInputError } from 'apollo-server-express'

export default {
  Query: {
    chats: (root, args, context, info) => {
      return Chat.find({})
    }
  },
  Mutation: {
    startChat: async (root, args, context, info) => {
      const { req } = context
      const { title, userIds } = args
      const { userId } = req.session
      await Joi.validate(args, startChat(userId), { abortEarly: false })
      const idsFound = await User.where('_id').in(userIds).countDocuments()
      if (idsFound !== userIds.length) {
        throw new UserInputError('One or more User IDs are invalid.')
      }
      userIds.push(userId)
      const chat = await Chat.create({ title, users: userIds })
      await User.updateMany({ _id: { '$in': userIds } }, {
        $push: { chats: chat }
      })
      return chat
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
