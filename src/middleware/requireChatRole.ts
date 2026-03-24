import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.js'
import { ChatRole } from '@prisma/client'

export function requireChatRole(role: ChatRole) {
  return async (req: Request<{ chatId: string }>, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const member = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId: user.id,
          chatId: req.params.chatId
        }
      }
    })
    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Not a member of this chat.'
      })
    }
    if (role === 'ADMIN' && member.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      })
    }
    req.chatMember = member
    next()
  }
}
