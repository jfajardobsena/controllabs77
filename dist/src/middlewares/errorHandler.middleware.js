"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const domain_error_1 = require("../errors/domain.error");
const domainErrorStatus = {
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
};
const globalErrorHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    if (err instanceof domain_error_1.DomainError) {
        res.status(domainErrorStatus[err.code]).json({
            success: false,
            code: err.code,
            error: err.message
        });
        return;
    }
    if (typeof err === 'object' &&
        err !== null &&
        'type' in err &&
        err.type === 'entity.parse.failed') {
        res.status(400).json({
            success: false,
            error: 'El cuerpo JSON está malformado.'
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor en ControlLabs',
        timestamp: new Date().toISOString()
    });
};
exports.globalErrorHandler = globalErrorHandler;
