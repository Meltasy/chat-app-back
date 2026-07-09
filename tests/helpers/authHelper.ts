import request from 'supertest'
import { app } from './testServer.js'

interface TestUser {
  username: string
  email: string
  password: string
}

let counter = 0

function numberToLetters(num: number): string {
  let letters = ''
  let n = num
  do {
    letters = String.fromCharCode(65 + (n % 26)) + letters
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
    return letters
}

export function buildUser(overrides: Partial<TestUser> = {}): TestUser {
  counter += 1
  const suffix = numberToLetters(counter)
  return {
    username: `Test User ${suffix}`,
    email: `testuser${counter}@example.com`,
    password: `TestUser${suffix}123#`,
    ...overrides
  }
}

export async function registerUser(overrides: Partial<TestUser> = {}) {
  const user = buildUser(overrides)
  const res = await request(app).post('/index/register').send(user)
  if (!res.body.success) {
    throw new Error(`registerUser helper failed: ${res.body.message}`)
  }
  return {
    token: res.body.token as string,
    userId: res.body.user.userId as string,
    username: user.username,
    email: user.email,
    password: user.password
  }
}
