import { randomUUID } from 'node:crypto'
import { validateNewChat, validateChatName, validateMessage } from '../../../src/validations/chatValidation.js'
import { runValidation } from '../../helpers/validationHelper.js'

describe('validateNewChat - members', () => {
  it('accepts a valid array of member UUIDs', async () => {
    const result = await runValidation(validateNewChat, { members: [randomUUID(), randomUUID()] })
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects an empty members array', async () => {
    const result = await runValidation(validateNewChat, { members: [] })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a members value that is not an array', async () => {
    const result = await runValidation(validateNewChat, { members: 'not-an-array' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a malformed (non-UUID) member id', async () => {
    const result = await runValidation(validateNewChat, { members: ['not-a-uuid'] })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects duplicate member ids in the same array', async () => {
    const id = randomUUID()
    const result = await runValidation(validateNewChat, { members: [id, id] })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateNewChat - optional name', () => {
  it('accepts a missing name (it is optional)', async () => {
    const result = await runValidation(validateNewChat, { members: [randomUUID(), randomUUID()] })
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects a name below the 5 character minimum, when provided', async () => {
    const result = await runValidation(validateNewChat, { 
      members: [randomUUID(), randomUUID()],
      name: 'Hi'
    })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a name above the 100 character maximum, when provided', async () => {
    const result = await runValidation(validateNewChat, { 
      members: [randomUUID(), randomUUID()],
      name: 'Super Radicals'.repeat(10)
    })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateChatName', () => {
  it('accepts a valid name', async () => {
    const result = await runValidation(validateChatName, { name: 'Super Radicals' })
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects a missing name', async () => {
    const result = await runValidation(validateChatName, {})
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a name below the 5 character minimum', async () => {
    const result = await runValidation(validateChatName, { name: 'Hi' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a name above the 100 character maximum', async () => {
    const result = await runValidation(validateChatName, { name: 'Super Radicals'.repeat(8) })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateMessage', () => {
  it('accepts a valid message', async () => {
    const result = await runValidation(validateMessage, { text: 'Hello there!' })
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects a missing message', async () => {
    const result = await runValidation(validateMessage, {})
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a message below the 5 character minimum', async () => {
    const result = await runValidation(validateMessage, { text: 'Hi' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a message above the 250 character maximum', async () => {
    const result = await runValidation(validateMessage, { text: 'Super Radicals'.repeat(20) })
    expect(result.isEmpty()).toBe(false)
  })
})
