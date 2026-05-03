import { mediaRepository } from "./media.repository.js";
import { MediaStatus } from "../../database/entities/media.entity.js";
import { AppError } from "../../common/errors/app.error.js";


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
            status: MediaStatus.PROCESSING,
        });

    },

    async markProcessing(id: string){
        const media = await mediaRepository.findById(id)
        if(!media){
            throw new AppError("Media not found",404)
        }
        

        if(media.status !== MediaStatus.PENDING){
            throw new AppError("Invalid state transition",409)
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