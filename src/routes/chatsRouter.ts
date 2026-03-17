import { Router } from 'express'
import { getChats, createChat, renameChat, getChatMessages, sendChatMessage } from '../controllers/chatsController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'
import { validateNewChat, validateChatName, validateNewMessage } from '../validations/chatValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const chatsRouter = Router()

chatsRouter.use(authenticate)

chatsRouter.get('/', getChats)
chatsRouter.post('/newChat', validateNewChat, handleValidation, createChat)
chatsRouter.patch<{ chatId: string }>('/:chatId/name', validateUuidParam('chatId'), validateChatName, handleValidation, renameChat)
chatsRouter.get<{ chatId: string }>('/:chatId/messages', validateUuidParam('chatId'), handleValidation, getChatMessages)
chatsRouter.post<{ chatId: string }>('/:chatId/newMessage', validateUuidParam('chatId'), validateNewMessage, handleValidation, sendChatMessage)

export default chatsRouter
