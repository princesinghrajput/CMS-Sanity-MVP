import { DataSource } from 'typeorm'
import { config } from '../config/env.js'
import { User } from './entities/user.entity.js'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cms',
    entities: [User],
    migrations: [],
    synchronize: false,
    logging: true
})
