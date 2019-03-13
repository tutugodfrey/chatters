import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { User, Chat } from './models'
import { JWT_SECRET } from '../src/config'

const signedIn = req => req.headers.token
const userExist = async (req) => {
  const user = await User.findById(req.session.userId)
  return user
}

export const ensureSignedIn = async req => {
  const token = signedIn(req)
  if (!token) throw new AuthenticationError('Please provide a token.')
  const user = await jwt.verify(token, JWT_SECRET)

  // add user detail to req header
  req.headers.user = user
}

export const ensureSignedOut = req => {
  // Check that user have active session
  // also check that user exist in the database
  const user = signedIn(req)
  const checkUser = userExist(req)
  if (user & checkUser) {
    throw new AuthenticationError('You are already singned in.')
  }
}

export const attemptSignIn = async (email, password) => {
  const user = await User.findOne({ email })
  const message = 'Incorrect email or password. Please try again.'
  if (!user) {
    throw new AuthenticationError(message)
  }
  if (!await user.matchesPassword(password)) {
    throw new AuthenticationError(message)
  }
  const payload = {
    name: user.name,
    email: user.email,
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 })
  user.token = token
  return user
}

export const isAdmin = async (id) => {
  const user = await User.findById(id)
  const message = 'You are not allowed to perform this action'
  if (!user.isAdmin) throw new AuthenticationError(message)
  return user
}

/**
 * Check that users are associated with a chat they
 * want to work with
 * @param {*} userId id of authenticated user
 * @param {*} chatId Id of chat user want to interact with
 * @return { Boolean } true if userId belong to the chat.users
 */
export const checkUserChat = async (userId, chatId) => {
  const chat = await Chat.findById(chatId)
  if (chat && chat.users.indexOf(userId) !== -1) {
    return true
  }
  return false
}
