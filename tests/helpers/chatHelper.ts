import request from 'supertest'
import { app } from './testServer.js'

interface CreateChatOptions {
  token: string
  memberIds: string[]
  name?: string
}

interface ChatMember {
  userId: string
  user: { username: string }
  role: 'ADMIN' | 'MEMBER'
}

interface Chat {
  id: string
  name: string | null
  isGroup: boolean
  members: ChatMember[]
}

export async function createChat({ token, memberIds, name }: CreateChatOptions): Promise<Chat> {
  const res = await request(app)
    .post('/chats/newChat')
    .set('Authorization', `Bearer ${token}`)
    .send(name ? { members: memberIds, name } : { members: memberIds })
  if (!res.body.success) {
    throw new Error(`createChat helper failed: ${res.body.message}`)
  }
  return res.body.chat as Chat
}
