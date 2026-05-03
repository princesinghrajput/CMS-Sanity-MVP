import {z} from 'zod'

export const createMediaSchema = z.object({
    originalKey: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().positive(),
})

