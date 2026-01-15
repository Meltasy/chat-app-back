import { Router } from 'express'
import { createChat, getChatMessages, sendChatMessage } from '../controllers/chatsController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'

const chatsRouter = Router()

chatsRouter.post('/new', authenticate, createChat)
chatsRouter.get('/:chatId', authenticate, getChatMessages)
chatsRouter.post('/:chatId', authenticate, sendChatMessage)

export default chatsRouter
