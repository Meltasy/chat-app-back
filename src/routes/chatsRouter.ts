import { Router } from 'express'
import { getChats, createChat, renameChat, deleteChat, addMember, removeMember } from '../controllers/chatsController.js'
import { requireChatRole } from '../middleware/requireChatRole.js'
import { validateNewChat, validateChatName } from '../validations/chatValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

// Add update member to admin role route

const chatsRouter = Router()

chatsRouter.get('/', getChats)
chatsRouter.post('/newChat', validateNewChat, handleValidation, createChat)
chatsRouter.patch('/:chatId/name', 
  validateUuidParam('chatId'), validateChatName, handleValidation, 
  requireChatRole('ADMIN'), renameChat)
chatsRouter.delete('/:chatId', 
  validateUuidParam('chatId'), requireChatRole('ADMIN'), deleteChat)
chatsRouter.post('/:chatId/members', 
  validateUuidParam('chatId'), requireChatRole('ADMIN'), addMember)
chatsRouter.delete('/:chatId/members/:userId', 
  validateUuidParam('chatId'), validateUuidParam('userId'), 
  requireChatRole('ADMIN'), removeMember)

export default chatsRouter
