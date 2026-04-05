// Add uploading static files, e.g. profile pics
// Add IA for predictive messaging, or creating profile pic, or ??
// Add testing using SuperTest: https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers

import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import indexRouter from './routes/indexRouter.js'
import userRouter from './routes/userRouter.js'
import chatsRouter from './routes/chatsRouter.js'
import messagesRouter from './routes/messagesRouter.js'
import { authenticate } from './authentication/jwtAuthenticate.js'
import { PORT } from './config/env.js'

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)
  socket.on('join_user_room', (userId: string) => {
    socket.join(`user_${userId}`)
  })
  socket.on('join_chat', (chatId: string) => {
    socket.join(chatId)
  })
  socket.on('leave_chat', (chatId: string) => {
    socket.leave(chatId)
  })
  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
  })
})

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/index', indexRouter)
app.use('/user', authenticate, userRouter)
app.use('/chats', authenticate)
app.use('/chats', chatsRouter)
app.use('/chats', messagesRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('The backend is up and running.')
})

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: true,
    message: 'Page not found'
  })
})

interface CustomError extends Error {
  status?: number
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    error: true,
    message: 'Internal server error'
  })
})

httpServer.listen(PORT, () => {
  console.log(`Message App listening on port ${PORT}`)
})
