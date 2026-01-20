import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { CustomJwtPayload } from '../types/express.js'

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header.' })
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Missing token.' })
  }
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined.')
    }
    const decoded = jwt.verify(token, secret) as CustomJwtPayload
    req.user = decoded
    next()
  } catch (err) {
    console.error('Invalid token:', err)
    res.status(403).json({ error: 'Invalid token.' })
  }
}

export { authenticate }
