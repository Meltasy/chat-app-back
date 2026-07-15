import request from 'supertest'
import { app } from './testServer.js'

interface SendMessageOptions {
  token: string
  chatId: string
  text?: string
}

interface SentMessage {
  id: string
  text: string
  sentAt: string
  sender: { id: string; username: string }
}

export async function sendMessage({
  token,
  chatId,
  text = 'Hello there, this is a test message.'
}: SendMessageOptions): Promise<SentMessage> {
  const res = await request(app)
    .post(`/chats/${chatId}/messages`)
    .set('Authorization', `Bearer ${token}`)
    .send({ text })
  if (!res.body.success) {
    throw new Error(`SendMessage helper failed: ${res.body.message}`)
  }
  return res.body.data as SentMessage
}
