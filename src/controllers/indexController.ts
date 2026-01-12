import { prisma } from '../prisma.js'
import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express' 

async function register(req: Request, res: Response) {
  try {
    console.log('User data:', req.body)
    const { username, email, password } = req.body
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
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
    console.log('Created user:', user)
    return res.json({
      success: true,
      message: 'User registered correctly.',
      userId: user.id,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration.'
    })
  }
}

async function login(req: Request, res: Response) {
  try {
    console.log('User data:', req.body)
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) {
      return res.json({
        success: false,
        message: 'Email doesn\'t exist.'
      })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'The password is incorrect.'
      })
    }
    console.log('Logged in user:', user)
    return res.json({
      success: true,
      message: 'User now logged in.',
      userId: user.id,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({
      success: false,
      message: 'User login failed.'
    })
  }
}

export {
  register,
  login
}
