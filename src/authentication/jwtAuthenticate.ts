import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../config/env.js'
import { CustomJwtPayload } from '../types/express.js'

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header.' })
  }
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('id' in decoded) ||
      !('username' in decoded) ||
      !('email' in decoded)
    ) {
      return res.status(403).json({ error : 'Invalide token payload.'})
    }
    req.user = decoded as CustomJwtPayload
    next()
  } catch (err) {
    console.error('Invalid token:', err)
    res.status(403).json({ error: 'Invalid token.' })
  }
}

export { authenticate }
