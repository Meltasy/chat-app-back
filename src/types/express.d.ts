import { JwtPayload } from 'jsonwebtoken'

interface CustomJwtPayload extends JwtPayload {
  id: string
  username: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload
    }
  }
}

export { CustomJwtPayload }
