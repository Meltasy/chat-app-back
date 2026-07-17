import { validateNewUser, validateUpdatePassword } from '../../../src/validations/userValidation.js'
import { runValidation } from '../../helpers/validationHelper.js'

const validUser = {
  username: 'Test User',
  email: 'testuser@example.com',
  password: 'TestUser123#'
}

describe('validateNewUser - username', () => {
  it('accepts a valid multi-word username', async () => {
    const result = await runValidation(validateNewUser, validUser)
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects a username below the 5 character minimum', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, username: 'Al' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a username above the 100 character maximum', async () => {
    const result = await runValidation(validateNewUser, { 
      ...validUser, username: 'Abraham Lincoln'.repeat(10)
    })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a username containing a digit', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, username: 'Test User1' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a username with two spaces between words', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, username: 'Test  User' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects an empty username', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, username: '' })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateNewUser - email', () => {
  it('rejects a malformed email address', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, email: 'not-an-email' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects an empty email', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, email: '' })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateNewUser - password', () => {
  it('accepts a password meeting every condition', async () => {
    const result = await runValidation(validateNewUser, validUser)
    expect(result.isEmpty()).toBe(true)
  })
  it('rejects a password below the 8 character minimum', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'Test1' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password above the 24 character maximum', async () => {
    const result = await runValidation(validateNewUser, { 
      ...validUser, password: 'TestUser123#'.repeat(3) 
    })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password with no digit', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'TestUser#' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password with no lowercase letter', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'TESTUSER123#' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password with no uppercase letter', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'testuser123#' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password with no special character', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'TestUser123' })
    expect(result.isEmpty()).toBe(false)
  })
  it('rejects a password containing a space', async () => {
    const result = await runValidation(validateNewUser, { ...validUser, password: 'Test User123#' })
    expect(result.isEmpty()).toBe(false)
  })
})

describe('validateUpdatePassword - newPassword', () => {
  it('rejects a missing currentPassword', async () => {
    const result = await runValidation(validateUpdatePassword, { newPassword: 'ValidUser123#' })
    expect(result.isEmpty()).toBe(false)
  })
  it('applies the same password rules as registration to newPassword', async () => {
    const result = await runValidation(validateUpdatePassword, {
      currentPassword: 'TestUser123#',
      newPassword: 'validuser123#'
    })
    expect(result.isEmpty()).toBe(false)
  })
  it('accepts a valid currentPassword and newPassword pair', async () => {
    const result = await runValidation(validateUpdatePassword, {
      currentPassword: 'TestUser123#',
      newPassword: 'ValidUser123#'
    })
    expect(result.isEmpty()).toBe(true)
  })
})
