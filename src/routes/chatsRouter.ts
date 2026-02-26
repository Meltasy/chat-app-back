import { Router } from 'express'
import { createChat, getChats, getChatMessages, sendChatMessage } from '../controllers/chatsController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'
import { validateNewChat, validateNewMessage } from '../validations/chatValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const chatsRouter = Router()

chatsRouter.get<{ id: string }>('/:id/chats', authenticate, validateUuidParam('id'), getChats)
chatsRouter.get<{ chatId: string }>('/:chatId', authenticate, validateUuidParam('chatId'), getChatMessages)
chatsRouter.post('/new', authenticate, validateNewChat, handleValidation, createChat)
chatsRouter.post<{ chatId: string }>('/:chatId', authenticate, validateUuidParam('chatId'), validateNewMessage, handleValidation, sendChatMessage)

export default chatsRouter
