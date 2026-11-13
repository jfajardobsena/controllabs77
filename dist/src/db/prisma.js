"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const database_url_1 = require("./database-url");
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: (0, database_url_1.createDatabaseUrl)()
        }
    }
});
