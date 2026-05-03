import { mediaRepository } from "./media.repository.js";
import { MediaStatus } from "../../database/entities/media.entity.js";
import { AppError } from "../../common/errors/app.error.js";
import { config } from "../../config/env.js";
import { s3ObjectStorage } from "../../infrastructures/storage/s3-storage.js";
import { randomUUID } from "crypto";

function getFileExtension(fileName?: string) {
    if (!fileName) {
        return ""
    }

    const sanitizedName = fileName.split(/[\\/]/).pop() ?? ""
    const extension = sanitizedName.includes(".")
        ? sanitizedName.substring(sanitizedName.lastIndexOf(".")).toLowerCase()
        : ""

    return /^[a-z0-9.]{1,16}$/.test(extension) ? extension : ""
}

function createOriginalObjectKey(input: { userId: string; fileName?: string }) {
    const date = new Date().toISOString().slice(0, 10)
    return `media/originals/${input.userId}/${date}/${randomUUID()}${getFileExtension(input.fileName)}`
}

export const mediaService = {
    async createMedia(input: {
        userId: string;
        originalKey: string;
        mimeType: string;
        fileSize: number;
    }) {

        return mediaRepository.createMedia({
            userId: input.userId,
            mimeType: input.mimeType,
            originalKey: input.originalKey,
            fileSize: input.fileSize,
            status: MediaStatus.PENDING,
        });

    },

    async createPresignedUpload(input: {
        userId: string;
        fileName?: string;
        mimeType: string;
        fileSize: number;
    }) {
        if (input.fileSize > config.MAX_UPLOAD_SIZE_BYTES) {
            throw new AppError("File size exceeds upload limit", 413)
        }

        const originalKey = createOriginalObjectKey({
            userId: input.userId,
            fileName: input.fileName,
        })

        const media = await mediaRepository.createMedia({
            userId: input.userId,
            mimeType: input.mimeType,
            originalKey,
            fileSize: input.fileSize,
            status: MediaStatus.PENDING,
        })

        const upload = await s3ObjectStorage.createPresignedUploadUrl({
            objectKey: originalKey,
            mimeType: input.mimeType,
            expiresInSeconds: config.S3_UPLOAD_URL_EXPIRES_SECONDS,
        })

        return {
            media,
            upload: {
                ...upload,
                method: "PUT" as const,
                headers: {
                    "Content-Type": input.mimeType,
                },
            },
        }
    },

    async markProcessing(id: string){
        const media = await mediaRepository.findById(id)
        if(!media){
            throw new AppError("Media not found",404)
        }
        

        if(media.status !== MediaStatus.PENDING){
            throw new AppError("Invalid state transition",409)
        }

        const originalObjectExists = await s3ObjectStorage.objectExists(media.originalKey)
        if (!originalObjectExists) {
            throw new AppError("Original media object not found",409)
        }

        return mediaRepository.updateMedia(id,{
            status: MediaStatus.PROCESSING,
        })

     
    },

    async markReady(id: string, thumbnailKey: string){

        const media = await mediaRepository.findById(id)
        if(!media){
            throw new AppError("Media not found",404)
        }

        if(media.status !== MediaStatus.PROCESSING){
            throw new AppError("Invalid state transition",409)
        }

        return mediaRepository.updateMedia(id,{
            status: MediaStatus.READY,
            thumbnailKey,
        })
        
    },

    async markFailed(id: string, error: string){

        const media = await mediaRepository.findById(id)
        if(!media){
            throw new AppError("Media not found",404)
        }

        if(media.status !== MediaStatus.PROCESSING){
            throw new AppError("Invalid state transition",409)
        }

        return mediaRepository.updateMedia(id,{
            status: MediaStatus.FAILED,
            errorMessage: error,
        })
        
    },

   async getMedia(id: string){
        const media = await mediaRepository.findById(id)
        if(!media){
            throw new AppError("Media not found",404)
        }
        return media
    }
}
