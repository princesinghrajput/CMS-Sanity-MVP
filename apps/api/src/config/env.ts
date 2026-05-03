import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: new URL('../../../../.env', import.meta.url).pathname })

const schema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string()
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error(parsed.error.format())
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const config = {
  PORT: Number(env.PORT),
  NODE_ENV: env.NODE_ENV,
  DB_HOST: env.DB_HOST,
  DB_PORT: Number(env.DB_PORT),
  DB_USER: env.DB_USER,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_NAME: env.DB_NAME
}