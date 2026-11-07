"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoanPayload = void 0;
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
