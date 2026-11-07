"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const loan_entity_1 = require("../entities/loan.entity");
const room_entity_1 = require("../entities/room.entity");
const user_entity_1 = require("../entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'controllabs',
    schema: process.env.DB_SCHEMA ?? 'public',
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    entities: [loan_entity_1.LoanEntity, room_entity_1.RoomEntity, user_entity_1.UserEntity],
    migrations: [],
    subscribers: []
});
const initializeDatabase = async () => {
    if (!exports.AppDataSource.isInitialized) {
        await exports.AppDataSource.initialize();
    }
};
exports.initializeDatabase = initializeDatabase;
