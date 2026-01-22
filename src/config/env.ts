import 'dotenv/config'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined.')
}

export const JWT_SECRET = jwtSecret as string

export const PORT = process.env.PORT
