import dotenv from 'dotenv-safe'
dotenv.config()

const {
  DATABASE_URL,
  TEST_DATABASE_URL
} = process.env

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  JWT_SECRET,
  ADMIN_PASS,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_NAME
} = process.env
export const DATABASE = NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL
export const IN_PROD = NODE_ENV === 'production'
