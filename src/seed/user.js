import mongoose from 'mongoose'
import User from '../models/user'
import { DATABASE, ADMIN_PASS, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_NAME } from '../config'

mongoose.Promise = global.Promise
mongoose.connect(DATABASE, { useNewUrlParser: true })
const user = new User({
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  username: ADMIN_USERNAME,
  password: ADMIN_PASS,
  isAdmin: true
})

const createAdmin = async () => {
  const result = await user.save()
  if (result) {
    console.log(result)
    await disconnect()
  }
}

const disconnect = async () => {
  await mongoose.disconnect()
}

createAdmin()
export default createAdmin
