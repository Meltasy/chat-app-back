import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface CreateChatBody {
  members: string[]
}

interface SendMessageBody {
  text: string
}

async function findPrevDM(memberIds: string[]) {
  if (memberIds.length !== 2) return null
  const chats = await prisma.chat.findMany({
    where: {
      isGroup: false,
      AND: memberIds.map(id => ({
        members: { some: { userId: id } }
      }))
    },
    include: { members: true }
  })
  return chats.find(chat => chat.members.length === 2) ?? null
}

async function createChat(req: Request<{}, {}, CreateChatBody>, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { members }= req.body
    if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
        success: false,
        message: 'Select at least one user.'
      })
    }
    const allMembers = Array.from(new Set([req.user.id, ...members]))
    const validUsers = await prisma.user.findMany({
       where: {id: { in: allMembers } },
       select: { id: true }
    })
    if (validUsers.length !== allMembers.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more member IDs are invalid.'
      })
    }
    const isGroup = allMembers.length > 2
    if (!isGroup) {
      const prevDM = await findPrevDM(allMembers)
      if (prevDM) {
        return res.json({
          success: true,
          message: 'Direct message already exists.',
          chat: prevDM
        })
      }
    }
    const chat = await prisma.chat.create({
      data: {
        isGroup,
        ...(isGroup && { name: 'New Group'}),
        members: {
          create: allMembers.map((memberId) => ({
            role: memberId === req.user!.id ? 'ADMIN' : 'MEMBER',
            user: { connect: { id: memberId }}
          }))
        }
      },
      include: {
        members: {
          select: {
            role: true,
            userId: true,
            user: { select: { username: true } }
          }
        }
      }
    })
    return res.json({
      success: true,
      message: isGroup ? 'Group chat created.' : 'Direct message created.',
      chat
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while creating chat.'
    })
  }
}

async function getChats(req: Request, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: { userId: user.id }
        }
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
            user: { select: { username: true }}
          }
        },
        messages: {
          select: {
            text: true,
            sentAt: true,
            sender: { select: { username: true } }
          },
          orderBy: { sentAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })
    const simpleChats = chats.map(chat => {
      let chatName = chat.name
      if (!chat.isGroup) {
        const otherUser = chat.members.find(
          m => m.userId !== user.id
        )?.user
        chatName = otherUser?.username ?? 'Unknown User'
      }
      return {
        id: chat.id,
        name: chatName,
        isGroup: chat.isGroup,
        lastMessage: chat.messages[0] ?? null,
        members: chat.members.map(mem => ({
          id: mem.userId,
          username: mem.user.username,
          role: mem.role
        }))
      }
    })
    return res.json({
      success: true,
      message: 'Chats now showing.',
      chats: simpleChats
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

async function getChatMessages(req: Request<{chatId: string}>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.chatId },
      include: {
        messages: {
          select: {
            text: true,
            sentAt: true,
            sender: { select: { username: true }
            }
          },
          orderBy: { sentAt: 'desc' },
          // This takes only single most recent message for each chat - as a preview
          // take: 20,
          // This skips
          // skip: parseInt(req.query.page) * 20,
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
      return res.status(404).json({
        success: false,
        message: 'Chat not found.'
      })
    }
    const isMember = chat.members.some(m => m.userId === user.id)
    if (!isMember) {
        return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat.'
      })
    }
    const simpleMembers = chat.members.map(m => ({
      id: m.userId,
      username: m.user.username,
      role: m.role
    }))
    return res.json({
      success: true,
      message: `${chat.name ?? 'Chat'} now showing.`,
      chat,
      members: simpleMembers
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while finding chat.'
    })
  }
}

async function sendChatMessage(req: Request<{chatId: string}, {}, SendMessageBody>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.chatId },
      include: {
        members: { select: { userId: true } }
      }
    })
    if (!chat) {
      return res.status(404).json ({
        success: false,
        message: 'Chat not found.'
      })
    }
    const isMember = chat.members.some(m => m.userId === user.id)
    if (!isMember) {
        return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat.'
      })
    }
    const message = await prisma.message.create({
      data: {
        text: req.body.text,
        senderId: user.id,
        chatId: req.params.chatId
      },
      include: {
        sender: { select : { username: true } }
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
        sender: { username: message.sender.username }
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while sending message.'
    })
  }
}

export {
  createChat,
  getChats,
  getChatMessages,
  sendChatMessage
}
