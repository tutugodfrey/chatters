import { User } from '../models'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

import { signUp, signIn, objectId } from '../schemas'
import { attemptSignIn, isAdmin } from '../auth'
export default {
  Query: {
    status: () => 'Chatter app is live and running',
    signedInUser: (root, args, context, info) => {
      const { req } = context
      return User.findById(req.headers.user.id)
    },
    users: (root, args, context, info) => {
      return User.find({})
    },
    user: async (root, args, context, info) => {
      const { id } = args
      await Joi.validate(args, objectId)
      return User.findById(id)
    }
  },
  Mutation: {
    signUp: async (root, args, context, info) => {
      await Joi.validate(args, signUp, { abortEarly: false })
      const user = await User.create(args)
      const payload = {
        name: user.name,
        email: user.email,
        username: user.username,
        id: user.id
      }
      const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 })
      payload.token = token
      return payload
    },
    signIn: async (root, args, context, info) => {
      const { email, password } = args
      await Joi.validate(args, signIn, { abortEarly: false })
      const user = await attemptSignIn(email, password)
      return user
    },

    deleteUser: async (root, args, context, info) => {
      const { req } = context
      const user = await isAdmin(req.headers.user.id)
      if (user) {
        const result = await User.deleteOne({ _id: args.id })
        if (result.deletedCount === 1) {
          return 'User successfully deleted'
        }
        return 'no user found'
      }
    }
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate('chats').execPopulate()).chats
    }
  }
}
