import request from 'supertest'
import { app } from '../helpers/testServer.js'
import { prisma, resetDatabase, disconnectPrisma } from '../helpers/prismaTestClient.js'

const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'TestUser123#'
}

beforeEach(async () => {
  await resetDatabase()
})

afterAll(async () => {
  await resetDatabase()
  await disconnectPrisma()
})

describe('POST /index/register', () => {
  it('registers a new user and returns a token', async () => {
    const res = await request(app)
      .post('/index/register')
      .send(testUser)
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.token).toEqual(expect.any(String))
      expect(res.body.user).toMatchObject({
        username: testUser.username,
        email: testUser.email
      })
      const stored = await prisma.user.findUnique({ where: { email: testUser.email } })
      expect(stored).not.toBeNull()
  })
  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/index/register').send(testUser)
    const res = await request(app)
      .post('/index/register')
      .send({ ...testUser, username: 'exampleuser' })
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })
  it('rejects an invalid payload with a validation error', async () => {
    const res = await request(app)
      .post('/index/register')
      .send({ username: '', email: 'false-email', password: '123' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})

describe('POST /index/login', () => {
  beforeEach(async () => {
    await request(app).post('/index/register').send(testUser)
  })
  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/index/login')
      .send({ email: testUser.email, password: testUser.password })
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.token).toEqual(expect.any(String))
  })
  it('rejects an incorrect password with 401', async () => {
    const res = await request(app)
      .post('/index/login')
      .send({ email: testUser.email, password: 'wrongPassword' })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
