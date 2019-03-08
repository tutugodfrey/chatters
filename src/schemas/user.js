import Joi from 'joi'
const email = Joi.string().email().required().label('Email')
const username = Joi.string().min(4).max(10).required().label('Username')
const name = Joi.string().max(30).required().label('Name')
const password = Joi.string().regex(/^(?=\S*[a-z])(?=\S*[A-Z)(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/).label('Password').options({
  language: {
    string: {
      regex: {
        base: 'Must contain at least one lowercase letter, one uppercase, one digit and one specail character'
      }
    }
  }
})

export const signUp = Joi.object().keys({
  email, username, name, password
})

export const signIn = Joi.object().keys({
  email, password
})
