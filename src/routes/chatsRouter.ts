import { Router } from 'express'
import { createChat, getChatMessages, sendChatMessage } from '../controllers/chatsController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'
import { validateNewChat, validateNewMessage } from '../validations/chatValidation.js'

const chatsRouter = Router()

chatsRouter.post('/new', authenticate, validateNewChat, createChat)
chatsRouter.get<{ chatId: string }>('/:chatId', authenticate, getChatMessages)
chatsRouter.post<{ chatId: string }>('/:chatId', authenticate, validateNewMessage, sendChatMessage)

export default chatsRouter
