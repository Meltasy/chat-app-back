import { Router } from 'express'
import { getMessages, sendChatMessage, editMessage, deleteMessage } from '../controllers/messagesController.js'
import { requireChatRole } from '../middleware/requireChatRole.js'
import { validateNewMessage } from '../validations/chatValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const messagesRouter = Router()

messagesRouter.get('/:chatId/messages', 
  validateUuidParam('chatId'), handleValidation,
  requireChatRole('MEMBER'), getMessages)
messagesRouter.post('/:chatId/messages', 
  validateUuidParam('chatId'), validateNewMessage, handleValidation, 
  requireChatRole('MEMBER'), sendChatMessage)
messagesRouter.patch('/:chatId/messages/:messageId', 
  validateUuidParam('chatId'), validateUuidParam('messageId'), handleValidation, 
  requireChatRole('MEMBER'), editMessage)
messagesRouter.delete('/:chatId/messages/:messageId', 
  validateUuidParam('chatId'), validateUuidParam('messageId'), 
  requireChatRole('MEMBER'), deleteMessage)

export default messagesRouter
