import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface MessageBody {
  text: string
}

interface ChatParams {
  chatId: string
  [key: string]: string
}

interface MessageParams {
  chatId: string
  messageId: string
  [key: string]: string
}

async function getMessages(req: Request<ChatParams>, res: Response) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.chatId },
      include: {
        messages: {
          select: {
            id: true,
            text: true,
            sentAt: true,
            sender: { select: { id: true, username: true }
            }
          },
          orderBy: { sentAt: 'asc' },
        },
        members: {
          select: {
            role: true,
            userId: true,
            user: { select: { username: true } }
          }
        }
      }
    })
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found.' })
    }
    return res.json({
      success: true,
      message: `${chat.name ?? 'Chat'} now showing.`,
      chat: {
        id: chat.id,
        name: chat.name,
        isGroup: chat.isGroup,
        members: chat.members.map(m => ({
          id: m.userId,
          username: m.user.username,
          role: m.role
        })),
        messages: chat.messages
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while finding chat.'
    })
  }
}

async function sendMessage(req: Request<ChatParams, {}, MessageBody>, res: Response) {
  try {
    const message = await prisma.message.create({
      data: {
        text: req.body.text,
        senderId: req.user!.id,
        chatId: req.params.chatId
      },
      include: {
        sender: { select : { id: true, username: true } }
      }
    })
    await prisma.chat.update({
      where: { id: req.params.chatId },
      data: { lastMessageAt: new Date() }
    })
    return res.json({
      success: true,
      message: 'Message sent successfully.',
      data: {
        id: message.id,
        text: message.text,
        sentAt: message.sentAt,
        sender: { id: message.sender.id, username: message.sender.username }
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while sending message.'
    })
  }
}

async function editMessage( req: Request<MessageParams, {}, MessageBody>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { messageId, chatId } = req.params
    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message || message.chatId !== chatId) {
      return res.status(404).json({ success: false, message: 'Message not found.' })
    }
    if (message.senderId !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages.'
      })
    }
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { text: req.body.text },
      select: { id: true, text: true, sentAt: true }
    })
    return res.json({ success: true, message: 'Message updated.', data: updated })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while editing message.'
    })
  }
}

async function deleteMessage(req: Request<MessageParams>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { messageId, chatId } = req.params
    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message || message.chatId !== chatId) {
      return res.status(404).json({ success: false, message: 'Message not found.' })
    }
    if (message.senderId !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages.'
      })
    }
    await prisma.message.delete({ where: { id: messageId } })
    return res.json({ success: true, message: 'Message deleted.' })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting message.'
    })
  }
}

export {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage
}
