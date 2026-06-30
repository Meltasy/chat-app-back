import { prisma } from '../prisma.js'
import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'

interface UserParams {
  userId: string
  [key: string]: string
}

interface UpdateUsernameBody {
  username: string
}

interface UpdatePasswordBody {
  currentPassword: string
  newPassword: string
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

async function updateUsername(req: Request<{}, {}, UpdateUsernameBody>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { username } = req.body
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    if (existingUser && existingUser.id !== user.id) {
      return res.status(409).json({
        success: false,
        message: `Username already exists.`
      })
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { username },
      select: { id: true, username: true, email: true }
    })
    return res.json({
      success: true,
      message: 'Username updated.',
      user: updated
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while updating username.'
    })
  }
}

async function updatePassword(req: Request<{}, {}, UpdatePasswordBody>, res: Response) {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      })
    }
    const { currentPassword, newPassword } = req.body
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: `User not found.`
      })
    }
    const match = await bcrypt.compare(currentPassword, dbUser.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      })
    }
    const hashPword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashPword }
    })
    return res.json({
      success: true,
      message: 'Password updated.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while updating password.'
    })
  }
}

export {
  getUser,
  getAllUsers,
  updateUsername,
  updatePassword
}
