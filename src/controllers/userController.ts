import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface UserParams {
  id: string
}

async function getUser(req: Request<UserParams>, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        id: true,
        username: true
      }
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }
    return res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error finding user:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

async function getChats(req: Request<UserParams>, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these chats.'
      })
    }
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: req.params.id
          }
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true
          }
        },
        messages: {
          select: {
            text: true,
            sentAt: true,
            sender: {
              select: {
                username: true
              }
            }
          },
          orderBy: {
            sentAt: 'desc'
          },
          // This takes only single most recent message for each chat - as a preview
          // take: 1
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })
    return res.json({
      success: true,
      message: 'Chats now showing.',
      chats
    })
  } catch (error) {
    console.error('Error finding chats:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

export {
  getUser,
  getChats
}
