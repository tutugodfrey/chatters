import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
import { SESS_NAME } from '../src/config'

const signedIn = req => req.session.userId

export const checkSignedIn = req => {
  if (!signedIn(req)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const checkSignedOut = req => {
  if (signedIn(req)) {
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
  return user
}

export const signOut = (req, res) => new Promise(
  (resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err)
      res.clearCookie(SESS_NAME)
      resolve(true)
    })
  }
)

export const isAdmin = async (id) => {
  const user = await User.findById(id)
  const message = 'You are not allowed to perform this action'
  if (!user.isAdmin) throw new AuthenticationError(message)
  return user
}