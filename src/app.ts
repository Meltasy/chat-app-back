import express, { Request, Response, NextFunction } from 'express'
import indexRouter from './routes/indexRouter'
import userRouter from './routes/userRouter'
import messagesRouter from './routes/messagesRouter'

const app = express()

app.use('/index', indexRouter)
app.use('/user', userRouter)
app.use('/messages', messagesRouter)

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
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: true,
    message: 'Internal server error'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Message App listening on port ${PORT}`)
})
