import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

async function createChat(req: Request, res: Response) {
  try {
    console.log('name:', req.body.name)
    const chat = await prisma.chat.create({
      data: {
        name: req.body.name,
        members: {
          // connect and how to use it:
          // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-an-existing-record
          // https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
          connect: req.body.members.map((memberId: string) => ({ id: memberId }))
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
    console.log('chat:', chat)
    return res.json({
      success: true,
      message: `${chat.name} chat created.`,
      chat
    })
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({
      success: false,
      message: 'Server error occurred while creating chat.'
    })
  }
}

async function getChatMessages(req: Request, res: Response) {
  try {

  } catch (error) {

  }
}

async function sendChatMessage(req: Request, res: Response) {
  try {

  } catch (error) {

  }
}

export {
  createChat,
  getChatMessages,
  sendChatMessage
}
