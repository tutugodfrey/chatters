import mongoose from 'mongoose'
import User from '../models/user'
import { DATABASE_URL, ADMIN_PASS, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_NAME } from '../config'

mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
const user = new User({
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  username: ADMIN_USERNAME,
  password: ADMIN_PASS,
  isAdmin: true
})

user.save((err, result) => {
  if (err) {
    console.log('Admin user could not be created')
    console.log(err)
    disconnect()
  }
  if (result) {
    console.log('user seeded')
    console.log(result)
    disconnect()
  }
})

const disconnect = () => {
  mongoose.disconnect()
}
