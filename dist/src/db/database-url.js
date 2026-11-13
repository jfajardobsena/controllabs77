"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseUrl = void 0;
require("dotenv/config");
const requiredVariables = [
    'PGHOST',
    'PGPORT',
    'PGDATABASE',
    'PGUSER',
    'PGPASSWORD'
];
const getRequiredVariable = (name) => {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Falta la variable ${name} en .env.`);
    }
    return value;
};
const createDatabaseUrl = () => {
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);
    if (missingVariables.length > 0) {
        throw new Error(`Faltan variables de PostgreSQL en .env: ${missingVariables.join(', ')}`);
    }
    const port = Number(process.env.PGPORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('PGPORT debe ser un puerto entero entre 1 y 65535.');
    }
    const connectionUrl = new URL('postgresql://localhost');
    connectionUrl.hostname = getRequiredVariable('PGHOST');
    connectionUrl.port = String(port);
    connectionUrl.username = encodeURIComponent(getRequiredVariable('PGUSER'));
    connectionUrl.password = encodeURIComponent(getRequiredVariable('PGPASSWORD'));
    connectionUrl.pathname = `/${encodeURIComponent(getRequiredVariable('PGDATABASE'))}`;
    connectionUrl.searchParams.set('schema', process.env.PGSCHEMA || 'public');
    if (process.env.PGSSLMODE) {
        connectionUrl.searchParams.set('sslmode', process.env.PGSSLMODE);
    }
    const url = connectionUrl.toString();
    process.env.DATABASE_URL = url;
    return url;
};
exports.createDatabaseUrl = createDatabaseUrl;
