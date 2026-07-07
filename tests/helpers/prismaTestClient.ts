import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { prisma as appPrisma, pool as appPool } from '../../src/prisma.js'

const connectionString = process.env['DATABASE_URL']

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })

export async function resetDatabase() {
  await prisma.message.deleteMany()
  await prisma.chatMember.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.user.deleteMany()
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
  await pool.end()
  await appPrisma.$disconnect()
  await appPool.end()
}
