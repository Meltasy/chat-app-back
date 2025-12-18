import { Router, Request, Response } from 'express'

const messagesRouter = Router()

messagesRouter.get('/new', (req: Request, res: Response) => {
  res.send('Create new message')
})

messagesRouter.get('/:messageId', (req: Request, res: Response) => {
  const { messageId } = req.params
  res.send(`Message ID: ${messageId} Open message`)
})

// messagesRouter.post('/:messageId', (req: Request, res: Response) => {
//   const { messageId } = req.params
//   res.send(`Message ID: ${messageId} Send message`)
// })

export default messagesRouter
