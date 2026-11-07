import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { LoanEntity } from '../entities/loan.entity';
import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'controllabs',
  schema: process.env.DB_SCHEMA ?? 'public',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [LoanEntity, RoomEntity, UserEntity],
  migrations: [],
  subscribers: []
});

export const initializeDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
