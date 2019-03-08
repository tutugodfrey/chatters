import mongoose from 'mongoose'
import { hash, compare, compareSync } from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: email => User.dontExist({ email }),
      message: ({ value }) => `Email ${value} already taken`
    }
  },
  username: {
    type: String,
    validate: {
      validator: username => User.dontExist({ username }),
      message: ({ value }) => `Username ${value} is already taken.`
    }
  },
  name: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timeStamps: true
})

// encrypt user password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await hash(this.password, 10)
    } catch (err) {
      next(err)
    }
  }
  next()
})

userSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password)
}

userSchema.statics.dontExist = async function (options) {
  return await this.where(options).countDocuments() === 0
}

const User = mongoose.model('User', userSchema)

export default User
