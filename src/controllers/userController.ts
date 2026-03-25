import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface UserParams {
  userId: string
  [key: string]: string
}

async function getUser(req: Request<UserParams>, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { id: true, username: true }
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }
    return res.json({ success: true, user })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true }
    })
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found.'
      })
    }
    return res.json({ success: true, users })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

export {
  getUser,
  getAllUsers
}
