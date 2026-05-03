export type PresignedUploadInput = {
  objectKey: string
  mimeType: string
  expiresInSeconds: number
}

export type PresignedUploadResult = {
  uploadUrl: string
  objectKey: string
  expiresIn: number
}

export type ObjectStorage = {
  createPresignedUploadUrl(
    input: PresignedUploadInput
  ): Promise<PresignedUploadResult>

  objectExists(objectKey: string): Promise<boolean>
}