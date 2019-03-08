import { User } from '../models'
import mongoose from 'mongoose'
import Joi from 'joi'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import * as Auth from '../auth'
export default {
  Query: {
    signedInUser: (root, args, context, info) => {
      const { req } = context
      Auth.checkSignedIn(req)
      return User.findById(req.session.userId)
    },
    users: (root, args, context, info) => {
      const { req } = context
      Auth.checkSignedIn(req)
      return User.find({})
    },
    user: (root, args, context, info) => {
      const { id } = args
      const { req } = context
      Auth.checkSignedIn(req)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user id.`)
      }
      return User.findById(id)
    }
  },
  Mutation: {
    signUp: async (root, args, context, info) => {
      const { req } = context
      Auth.checkSignedOut(req)
      await Joi.validate(args, signUp, { abortEarly: false })
      const user = await User.create(args)
      req.session.userId = user.id
      return user
    },
    signIn: async (root, args, context, info) => {
      const { req } = context
      const { email, password } = args
      const { userId } = req.session
      if (userId) {
        return User.findById(userId)
      }
      await Joi.validate(args, signIn, { abortEarly: false })
      const user = await Auth.attemptSignIn(email, password)
      req.session.userId = user.id
      return user
    },
    signOut: (root, args, context, info) => {
      const { req, res } = context
      Auth.checkSignedIn(req)
      return Auth.signOut(req, res)
    },
    deleteUser: async (root, args, context, info) => {
      const { req } = context
      Auth.checkSignedIn(req)
      const user = await Auth.isAdmin(req.session.userId)
      if (user) {
        User.remove({ _id: args.id }, (err, user) => {
          if (err) {
            return 'no user found'
          }
          return 'user successfully deleted'
        })
      }
    }
  }
}
