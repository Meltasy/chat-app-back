import { JwtPayload } from 'jsonwebtoken'
import { ChatMember } from '@prisma/client'

interface CustomJwtPayload extends JwtPayload {
  id: string
  username: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload
      chatMember?: ChatMember
    }
  }
}

export { CustomJwtPayload }
