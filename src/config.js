import dotenv from 'dotenv-safe'
dotenv.config()

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  DATABASE_URL,
  SESS_NAME = 'sid',
  SESS_SECRET,
  SESS_LIFETIME = 1000 * 60 * 60 * 2,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  ADMIN_PASS,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_NAME
} = process.env
export const IN_PROD = NODE_ENV === 'production'
