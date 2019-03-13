import dotenv from 'dotenv-safe'
dotenv.config()

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  DATABASE_URL,
  JWT_SECRET,
  SESS_LIFETIME = 1000 * 60 * 60 * 2,
  ADMIN_PASS,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_NAME
} = process.env
export const IN_PROD = NODE_ENV === 'production'
