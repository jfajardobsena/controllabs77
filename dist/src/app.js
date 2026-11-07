"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const logger_middleware_1 = require("./middlewares/logger.middleware");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(logger_middleware_1.requestLogger);
app.use(express_1.default.json());
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'ControlLabs API operando correctamente',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/v1', routes_1.default);
if (process.env.NODE_ENV !== 'production') {
    app.get('/__test/error', (_req, _res, next) => {
        next(new Error('Error de prueba'));
    });
}
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Ruta no encontrada.' });
});
app.use(errorHandler_middleware_1.globalErrorHandler);
exports.default = app;
