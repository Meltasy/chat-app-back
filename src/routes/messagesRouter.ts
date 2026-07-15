import { Router } from 'express'
import { getMessages, sendMessage, editMessage, deleteMessage } from '../controllers/messagesController.js'
import { requireChatRole } from '../middleware/requireChatRole.js'
import { validateMessage } from '../validations/chatValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const messagesRouter = Router()

messagesRouter.get('/:chatId/messages', 
  validateUuidParam('chatId'), handleValidation,
  requireChatRole('MEMBER'), getMessages)
messagesRouter.post('/:chatId/messages', 
  validateUuidParam('chatId'), validateMessage, handleValidation, 
  requireChatRole('MEMBER'), sendMessage)
messagesRouter.patch('/:chatId/messages/:messageId', 
  validateUuidParam('chatId'), validateUuidParam('messageId'), validateMessage,
  handleValidation, requireChatRole('MEMBER'), editMessage)
messagesRouter.delete('/:chatId/messages/:messageId', 
  validateUuidParam('chatId'), validateUuidParam('messageId'), handleValidation,
  requireChatRole('MEMBER'), deleteMessage)

export default messagesRouter
