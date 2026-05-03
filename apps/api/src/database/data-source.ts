import { DataSource } from 'typeorm'
import { config } from '../config/env.js'
import { User } from './entities/user.entity.js'
import { Media } from './entities/media.entity.js'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [User, Media],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    logging: true
})
