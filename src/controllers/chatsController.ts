import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface CreateChatBody {
  members: string[]
  name?: string
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
            id: true,
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
    const currentUserId = req.user.id
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
    if (isGroup) {
      const groupName = req.body.name?.trim() || 'New Group'
      const duplicate = await prisma.chat.findFirst({
        where: {
          isGroup: true,
          name: groupName,
          members: { some: {userId: req.user.id } }
        }
      })
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'You already have a group with this name.'
        })
      }
      const chat = await prisma.chat.create({
        data: {
          isGroup: true,
          name: groupName,
          members: {
            create: allMembers.map((memberId) => ({
              role: memberId === currentUserId ? 'ADMIN' : 'MEMBER',
              user: { connect: { id: memberId } }
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
        message: 'Group chat created.',
        chat
      })
    } else {
      const prevDM = await findPrevDM(allMembers)
      if (prevDM) {
        return res.json({
          success: true,
          message: 'Direct message already exists.',
          chat: prevDM
        })
      }
      const chat = await prisma.chat.create({
        data: {
          isGroup: false,
          members: {
            create: allMembers.map((memberId) => ({
              role: memberId === currentUserId ? 'ADMIN' : 'MEMBER',
              user: { connect: { id: memberId } }
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
        message: 'Direct message created.',
        chat
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while creating chat.'
    })
  }
}

async function renameChat(req: Request<{chatId: string}, {}, {name: string}>, res: Response) {
  try {
    const chat = await prisma.chat.update({
      where: { id: req.params.chatId },
      data: { name: req.body.name }
    })
    return res.json({
      success: true,
      message: 'Chat renamed.',
      chat
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while renaming chat.'
    })
  }
}

async function deleteChat(req: Request<{chatId: string}>, res: Response) {
  try {
    await prisma.chat.delete({ where: {id: req.params.chatId } })
    return res.json({ 
      success: true,
      message: 'Chat deleted.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting chat.'
    })
  }
}

async function addMember(req: Request<{ chatId: string }, {}, { userId: string }>, res: Response) {
  try {
    const { userId } = req.body
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    const alreadyMember = await prisma.chatMember.findUnique({
      where: { userId_chatId: { userId, chatId: req.params.chatId } }
    })
    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: 'User is already a member.'
      })
    }
    const member = await prisma.chatMember.create({
      data: { userId, chatId: req.params.chatId, role: 'MEMBER' }
    })
    return res.json({
      success: true, 
      message: 'Member added.',
      member
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while adding member.'
    })
  }
}

async function removeMember(req: Request<{ chatId: string, userId: string}>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token payload.' })
    }
    const { chatId, userId } = req.params
    const admins = await prisma.chatMember.count({
      where: { chatId, role: 'ADMIN' }
    })
    if (userId === user.id && admins === 1) {
      return res.status(400).json({
        success: false,
        message: 'There must always be at least one admin.'
      })
    }
    await prisma.chatMember.delete({
      where: { userId_chatId: { userId, chatId } }
    })
    return res.json({
      success: true,
      message: 'Member removed.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while removing member.'
    })
  }
}

export {
  getChats,
  createChat,
  renameChat,
  deleteChat,
  addMember,
  removeMember
}
