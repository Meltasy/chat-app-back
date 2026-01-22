import { prisma } from '../prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { JWT_SECRET } from '../config/env.js'

interface RegisterBody {
  username: string
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

async function register(req: Request<{}, {}, RegisterBody>, res: Response) {
  try {
    let { username, email, password } = req.body
    username = username.toLowerCase()
    email = email.toLowerCase()
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })
    if (existingUser) {
      const conflict = existingUser.username === username ? 'Username' : 'Email'
      return res.status(409).json({
        success: false,
        message: `${conflict} already exists.`
      })
    }
    const hashPword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPword
      }
    })
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({
      success: true,
      message: 'User registered correctly.',
      token,
      user: { userId: user.id, username: user.username, email: user.email }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration.'
    })
  }
}

async function login(req: Request<{}, {}, LoginBody>, res: Response) {
  try {
    let { email, password } = req.body
    email = email.toLowerCase()
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    return res.json({
      success: true,
      message: 'User now logged in.',
      token,
      user: { userId: user.id, username: user.username, email: user.email }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User login failed.'
    })
  }
}

export {
  register,
  login
}
