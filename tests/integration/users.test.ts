import request from 'supertest'
import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { app } from '../helpers/testServer.js'
import { registerUser } from '../helpers/authHelper.js'
import { prisma, resetDatabase, disconnectPrisma } from '../helpers/prismaTestClient.js'

beforeEach(async () => {
  await resetDatabase()
})

afterAll(async () => {
  await resetDatabase()
  await disconnectPrisma()
})

describe('GET /user/allUsers', () => {
  it('rejects requests with no auth token with 401', async () => {
    const res = await request(app).get('/user/allUsers')
    expect(res.status).toBe(401)
  })
  it('returns all registered users when authenticated', async () => {
    const dragon = await registerUser()
    const lucky = await registerUser()
    const res = await request(app)
      .get('/user/allUsers')
      .set('Authorization', `Bearer ${dragon.token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.users).toHaveLength(2)
    expect(res.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: dragon.userId, username: dragon.username }),
        expect.objectContaining({ id: lucky.userId, username: lucky.username })
      ])
    )
  })
})

describe('GET /user/:userId', () => {
  it('rejects requests with no auth token with 401', async () => {
    const someId = randomUUID()
    const res = await request(app).get(`/user/${someId}`)
    expect(res.status).toBe(401)
  })
  it('returns the user when found', async () => {
    const dragon = await registerUser()
    const lucky = await registerUser()
    const res = await request(app)
      .get(`/user/${lucky.userId}`)
      .set('Authorization', `Bearer ${dragon.token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.user).toMatchObject({ id: lucky.userId, username: lucky.username })
  })
  it('returns 404 for a well-formed but non-existent userId', async () => {
    const lucky = await registerUser()
    const nonExistantId = randomUUID()
    const res = await request(app)
      .get(`/user/${nonExistantId}`)
      .set('Authorization', `Bearer ${lucky.token}`)
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })
  it('rejects a malformed (non-UUID) userId with 400', async () => {
    const dragon = await registerUser()
    const res = await request(app)
      .get('/user/not-a-valid-uuid')
      .set('Authorization', `Bearer ${dragon.token}`)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})

describe('PATCH /user/username', () => {
  it('rejects requests with no auth token with 401', async () => {
    const res = await request(app)
      .patch('/user/username')
      .send({ username: 'New Name' })
    expect(res.status).toBe(401)
  })
  it('rejects an invalid username with 400', async () => {
    const dragon = await registerUser()
    const res = await request(app)
      .patch('/user/username')
      .set('Authorization', `Bearer ${dragon.token}`)
      .send({ username: 'a1' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
  it('rejects a username already taken by someone else with 409', async () => {
    const dragon = await registerUser()
    const lucky = await registerUser()
    const res = await request(app)
      .patch('/user/username')
      .set('Authorization', `Bearer ${dragon.token}`)
      .send({ username: lucky.username })
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })
  it('updates the username and returns a new token', async () => {
    const lucky = await registerUser()
    const res = await request(app)
      .patch('/user/username')
      .set('Authorization', `Bearer ${lucky.token}`)
      .send({ username: 'Updated Name' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.token).not.toBe(lucky.token)
    const decoded = jwt.decode(res.body.token) as { username: string }
    expect(decoded.username).toBe('Updated Name')
    expect(res.body.user.username).toBe('Updated Name')
    const stored = await prisma.user.findUnique({ where: { id: lucky.userId } })
    expect(stored?.username).toBe('Updated Name')
  })
})


describe('PATCH /user/password', () => {
  it('rejects requests with no auth token with 401', async () => {
    const res = await request(app)
      .patch('/user/password')
      .send({ currentPassword: 'x', newPassword: 'NewPass123#' })
    expect(res.status).toBe(401)
  })
  it('rejects an invalid password with 400', async () => {
    const dragon = await registerUser()
    const res = await request(app)
      .patch('/user/password')
      .set('Authorization', `Bearer ${dragon.token}`)
      .send({ currentPassword: dragon.password, newPassword: 'short' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
  it('rejects an incorrect currentPassword with 401', async () => {
    const lucky = await registerUser()
    const res = await request(app)
      .patch('/user/password')
      .set('Authorization', `Bearer ${lucky.token}`)
      .send({ currentPassword: 'WrongPass123#', newPassword: 'NewPass123#' })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
  it('updates the password on current correct password', async () => {
    const dragon = await registerUser()
    const res = await request(app)
      .patch('/user/password')
      .set('Authorization', `Bearer ${dragon.token}`)
      .send({ currentPassword: dragon.password, newPassword: 'NewPass123#' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    const loginRes = await request(app)
      .post('/index/login')
      .send({ email: dragon.email, password: 'NewPass123#' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.success).toBe(true)
  })
})
