import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface CreateChatBody {
  name: string
  members: string[]
}

interface SendMessageBody {
  text: string
}

async function createChat(req: Request<{}, {}, CreateChatBody>, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { name, members }= req.body
    if (!members || !Array.isArray(members) || !members.includes(req.user.id)) {
        return res.status(403).json({
        success: false,
        message: 'You must be a member of the chat you create.'
      })
    }
    console.log('name:', req.body.name)
    console.log('members:', req.body.members)
    const chat = await prisma.chat.create({
      data: {
        name,
        members: {
          // connect and how to use it:
          // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-an-existing-record
          // https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
          connect: members.map((memberId) => ({ id: memberId }))
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
      message: `${chat.name} created.`,
      chat
    })
  } catch (error) {
    console.error('Error creating chat:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while creating chat.'
    })
  }
}

async function getChatMessages(req: Request<{chatId: string}>, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    console.log('chatId:', req.params.chatId)
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.chatId,
      },
      include: {
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
          // take: 20,
          // This skips
          // skip: parseInt(req.query.page) * 20,
        },
        members: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found.'
      })
    }
    const isMember = chat.members.some(member => member.id === req.user.id)
    if (!isMember) {
        return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat.'
      })
    }
    console.log('chat:', chat)
    return res.json({
      success: true,
      message: `${chat.name} now showing.`,
      chat
    })
  } catch (error) {
    console.error('Error finding chat:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while finding chat.'
    })
  }
}

async function sendChatMessage(req: Request<{chatId: string}, {}, SendMessageBody>, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    console.log('message:', req.body.text)
    if (req.body.text === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      })
    }
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.chatId
      },
      include: {
        members: {
          select: {
            id: true
          }
        }
      }
    })
    if (!chat) {
      return res.status(404).json ({
        success: false,
        message: 'Chat not found.'
      })
    }
    const isMember = chat.members.some(member => member.id === req.user.id)
    if (!isMember) {
        return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat.'
      })
    }
    await prisma.message.create({
      data: {
        text: req.body.text,
        senderId: req.user.id,
        chatId: req.params.chatId
      }
    })
    await prisma.chat.update({
      where: {
        id: req.params.chatId
      },
      data: {
        lastMessageAt: new Date()
      }
    })
    return res.json({
      success: true,
      message: 'Message sent successfully.'
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while sending message.'
    })
  }
}

export {
  createChat,
  getChatMessages,
  sendChatMessage
}
