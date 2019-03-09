import { Message } from '../models'
import { checkUserChat } from '../auth'

export default {
  Query: {
    messages: async (root, args, context, info) => {
      const { chatId } = args
      const { req } = context
      const { userId } = req.session
      const userExist = await checkUserChat(userId, chatId)

      // users must below to the chat of the message
      if (userExist) {
        return Message.find({ chat: chatId })
      }
    },
    message: async (root, args, context, info) => {
      const { messageId } = args
      const { req } = context
      const { userId } = req.session
      const message = await Message.findById(messageId)
      const userExist = checkUserChat(userId, message.chat)
      if (userExist) {
        return [message]
      }
    }
  },
  Mutation: {
    sendMessage: async (root, args, context, info) => {
      const { body, chatId } = args
      const { req } = context
      const { userId } = req.session
      const userExist = checkUserChat(userId, chatId)
      if (userExist) {
        const message = await Message.create({ body, sender: userId, chat: chatId })
        return message
      }
    },
    updateMessage: async (root, args, context, info) => {
      const { messageId, body } = args
      const { req } = context
      const { userId } = req.session
      const query = { _id: messageId }
      const data = {
        body
      }
      const options = {
        new: true
      }
      const message = Message.findById(messageId)
      const userExist = checkUserChat(userId, message.chat)
      if (userExist) {
        const newMessage = await Message.findOneAndUpdate(query, data, options)
        return newMessage
      }
    },
    deleteMessage: async (root, args, context, info) => {
      const { messageId } = args
      const { req } = context
      const { userId } = req.session
      const message = Message.findById(messageId)
      const userExist = await checkUserChat(userId, message.chat)
      if (userExist) {
        const result = await Message.deleteOne({ _id: messageId })
        if (result.deletedCount === 1) {
          return 'Message deleted'
        }
        return 'Message does not exist'
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
