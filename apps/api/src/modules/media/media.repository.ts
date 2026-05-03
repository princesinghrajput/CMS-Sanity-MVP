import { AppDataSource } from '../../database/data-source.js'
import { Media } from '../../database/entities/media.entity.js'

const repo = AppDataSource.getRepository(Media)

export const mediaRepository = {
  async createMedia(data: Partial<Media>) {
    const media = repo.create(data)
    return repo.save(media)
  },

  async findById(id: string) {
    return repo.findOne({ where: { id } })
  },

  async updateMedia(id: string, data: Partial<Media>) {
    await repo.update(id, data)
    return repo.findOne({ where: { id } })
  }
}