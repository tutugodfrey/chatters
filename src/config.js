import dotenv from 'dotenv-safe'
dotenv.config()

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  DATABASE_URL
} = process.env
export const IN_PROD = NODE_ENV === 'production'
