import { validationResult, type ValidationChain } from 'express-validator'
import type { Request } from 'express'

export async function runValidation(chains: ValidationChain[], body: Record<string, unknown>) {
  const req = { body } as Request
  await Promise.all(chains.map(chain => chain.run(req)))
  return validationResult(req)
}

export async function getValidationMessages(chains: ValidationChain[], body: Record<string, unknown>) {
  const result = await runValidation(chains, body)
  return result.array().map(e => e.msg)
}
