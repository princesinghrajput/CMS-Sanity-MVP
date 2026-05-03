import {z} from 'zod'

export const createMediaSchema = z.object({
    originalKey: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().int().positive(),
})

export const createPresignedUploadSchema = z.object({
    fileName: z.string().min(1).max(255).optional(),
    mimeType: z.string().min(1).max(255),
    fileSize: z.number().int().positive(),
})
