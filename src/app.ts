// Add testing using SuperTest: https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import indexRouter from './routes/indexRouter.js'
import userRouter from './routes/userRouter.js'
import chatsRouter from './routes/chatsRouter.js'
import { PORT } from './config/env.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/index', indexRouter)
app.use('/user', userRouter)
app.use('/chats', chatsRouter)

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

app.listen(PORT, () => {
  console.log(`Message App listening on port ${PORT}`)
})
