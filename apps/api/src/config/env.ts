import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const schema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development')
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error(parsed.error.format())
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const config = {
  PORT: Number(env.PORT),
  NODE_ENV: env.NODE_ENV
}