"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Forma recomendada en TS para reemplazar require('dotenv').config()
const app_1 = __importDefault(require("./src/app"));
const prisma_1 = require("./src/db/prisma");
const port = Number(process.env.PORT ?? 5000);
const describeStartupError = (error) => {
    if (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof error.code === 'string') {
        return error.code;
    }
    return error instanceof Error ? error.name : 'Unknown error';
};
const startServer = async () => {
    await prisma_1.prisma.$connect();
    const server = app_1.default.listen(port, () => {
        console.log(`Servidor ControlLabs corriendo en http://localhost:${port}`);
    });
    server.once('error', (error) => {
        console.error('No se pudo abrir el puerto HTTP:', error.code ?? error.name);
        process.exitCode = 1;
        void prisma_1.prisma.$disconnect().catch((disconnectError) => {
            console.error('Error al cerrar la conexión de Prisma:', disconnectError);
            process.exitCode = 1;
        });
    });
    let shuttingDown = false;
    const shutdown = (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        console.info(`Señal ${signal}: cerrando servidor y conexión a PostgreSQL.`);
        server.close((error) => {
            if (error) {
                console.error('Error al cerrar el servidor HTTP:', error);
                process.exitCode = 1;
            }
            void prisma_1.prisma.$disconnect().catch((disconnectError) => {
                console.error('Error al cerrar la conexión de Prisma:', disconnectError);
                process.exitCode = 1;
            });
        });
    };
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
};
void startServer().catch((error) => {
    console.error('No se pudo iniciar ControlLabs o conectar con PostgreSQL. Revisa DATABASE_URL y la disponibilidad del servidor.', describeStartupError(error));
    process.exitCode = 1;
    void prisma_1.prisma.$disconnect().catch((disconnectError) => {
        console.error('Error al cerrar la conexión de Prisma:', disconnectError);
        process.exitCode = 1;
    });
});
