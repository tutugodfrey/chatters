import { User } from '../models'
import Joi from 'joi'
import { signUp, signIn, objectId } from '../schemas'
import { attemptSignIn, signOut, isAdmin } from '../auth'
export default {
  Query: {
    signedInUser: (root, args, context, info) => {
      const { req } = context
      return User.findById(req.session.userId)
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
      const { req } = context
      await Joi.validate(args, signUp, { abortEarly: false })
      const user = await User.create(args)
      req.session.userId = user.id
      return user
    },
    signIn: async (root, args, context, info) => {
      const { req } = context
      const { email, password } = args
      await Joi.validate(args, signIn, { abortEarly: false })
      const user = await attemptSignIn(email, password)
      req.session.userId = user.id
      return user
    },
    signOut: (root, args, context, info) => {
      const { req, res } = context
      return signOut(req, res)
    },
    deleteUser: async (root, args, context, info) => {
      const { req } = context
      const user = await isAdmin(req.session.userId)
      if (user) {
        User.remove({ _id: args.id }, (err, user) => {
          if (err) {
            return 'no user found'
          }
          return 'user successfully deleted'
        })
      }
    }
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate('chats').execPopulate()).chats
    }
  }
}
