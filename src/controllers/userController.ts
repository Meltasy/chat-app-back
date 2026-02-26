import { prisma } from '../prisma.js'
import type { Request, Response } from 'express'

interface UserParams {
  id: string
}

async function getUser(req: Request<UserParams>, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
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
    return res.status(500).json({
      success: false,
      message: 'Server error occurred.'
    })
  }
}

export {
  getUser
}
