import { Message } from '../models'
import { checkUserChat } from '../auth'
import { UserInputError } from 'apollo-server-express'

export default {
  Query: {
    messages: async (root, args, context, info) => {
      const { chatId } = args
      const { req } = context
      const { id } = req.headers.user
      const userExist = await checkUserChat(id, chatId)

      // users must below to the chat of the message
      if (userExist) {
        return Message.find({ chat: chatId })
      }
    },
    message: async (root, args, context, info) => {
      const { messageId } = args
      const { req } = context
      const { id } = req.headers.user
      const message = await Message.findById(messageId)
      const userExist = checkUserChat(id, message.chat)
      if (userExist) {
        return [message]
      }
    }
  },
  Mutation: {
    sendMessage: async (root, args, context, info) => {
      const { body, chatId } = args
      const { req } = context
      const { id } = req.headers.user
      const userExist = await checkUserChat(id, chatId)
      if (userExist) {
        const message = await Message.create({ body, sender: id, chat: chatId })
        return message
      }
      throw new UserInputError('Chat does not exist.')
    },
    updateMessage: async (root, args, context, info) => {
      const { messageId, body } = args
      const { req } = context
      const { id } = req.headers.user
      const query = { _id: messageId }
      const data = {
        body
      }
      const options = {
        new: true
      }
      const message = await Message.findById(messageId)
      if (!message) throw new UserInputError('Message does not exist.')
      const userExist = await checkUserChat(id, message.chat)
      if (userExist) {
        const newMessage = await Message.findOneAndUpdate(query, data, options)
        return newMessage
      }
    },
    deleteMessage: async (root, args, context, info) => {
      const { messageId } = args
      const { req } = context
      const { id } = req.headers.user
      const message = await Message.findById(messageId)
      if (!message) throw new UserInputError('Message does not exist.')
      const userExist = await checkUserChat(id, message.chat)
      if (userExist) {
        const result = await Message.deleteOne({ _id: messageId })
        if (result.deletedCount === 1) {
          return 'Message has be deleted'
        }
      }
    }
  },
  Message: {
    sender: async (user, args, context, info) => {
      return (await user.populate('sender').execPopulate()).sender
    },
    chat: async (user, args, context, info) => {
      return (await user.populate('chat').execPopulate()).chat
    }
  }
}
