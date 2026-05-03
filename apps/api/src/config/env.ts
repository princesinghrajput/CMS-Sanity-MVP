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
  DB_NAME: z.string(),

  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_UPLOAD_URL_EXPIRES_SECONDS: z.coerce.number().positive().default(900),
  MAX_UPLOAD_SIZE_BYTES: z.coerce.number().positive().default(52_428_800),

  S3_ENDPOINT: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().optional().default(false)
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
  DB_NAME: env.DB_NAME,

  AWS_REGION: env.AWS_REGION,
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: env.S3_BUCKET_NAME,
  S3_UPLOAD_URL_EXPIRES_SECONDS: env.S3_UPLOAD_URL_EXPIRES_SECONDS,
  MAX_UPLOAD_SIZE_BYTES: env.MAX_UPLOAD_SIZE_BYTES,
  S3_ENDPOINT: env.S3_ENDPOINT,
  S3_FORCE_PATH_STYLE: env.S3_FORCE_PATH_STYLE
}