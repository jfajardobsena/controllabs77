"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoanSearchQuery = exports.validateLoanIdParameter = exports.validateLoanPayload = void 0;
const isUuid = (value) => typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const isCreateLoanDTO = (value) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const loan = value;
    const allowedFields = new Set([
        'roomId',
        'instructorId',
        'guardaId',
        'numeroPc'
    ]);
    return (Object.keys(loan).every((key) => allowedFields.has(key)) &&
        isUuid(loan.roomId) &&
        isUuid(loan.instructorId) &&
        isUuid(loan.guardaId) &&
        typeof loan.numeroPc === 'number' &&
        Number.isInteger(loan.numeroPc));
};
const validateLoanPayload = (req, res, next) => {
    const body = req.body;
    if (!isCreateLoanDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del préstamo inválidos.'
        });
        return;
    }
    next();
};
exports.validateLoanPayload = validateLoanPayload;
const validateLoanIdParameter = (req, res, next) => {
    const { id } = req.params;
    const isPositiveBigInt = /^[1-9]\d*$/.test(id) &&
        id.length <= 19 &&
        BigInt(id) <= 9223372036854775807n;
    if (!isPositiveBigInt) {
        res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            error: 'El identificador del préstamo debe ser un entero positivo.'
        });
        return;
    }
    next();
};
exports.validateLoanIdParameter = validateLoanIdParameter;
const validateLoanSearchQuery = (req, res, next) => {
    const { roomId } = req.query;
    const isUuid = roomId === undefined ||
        (typeof roomId === 'string' &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roomId));
    if (!isUuid) {
        res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            error: 'El filtro roomId debe ser un UUID válido.'
        });
        return;
    }
    next();
};
exports.validateLoanSearchQuery = validateLoanSearchQuery;
