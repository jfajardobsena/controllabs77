"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const domain_error_1 = require("../errors/domain.error");
class LoanService {
    loanRepository;
    constructor(loanRepository) {
        this.loanRepository = loanRepository;
    }
    async createLoan(input) {
        if (!Number.isInteger(input.numeroPc) || input.numeroPc <= 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El número de PCs debe ser un entero positivo.');
        }
        return this.loanRepository.create({
            roomId: input.roomId.toLowerCase(),
            instructorId: input.instructorId.toLowerCase(),
            guardaId: input.guardaId.toLowerCase(),
            numeroPc: input.numeroPc
        });
    }
    async getLoans(filters = {}) {
        if (filters.roomId !== undefined && !this.isUuid(filters.roomId)) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro roomId debe ser un UUID válido.');
        }
        return this.loanRepository.findAll({
            roomId: filters.roomId?.toLowerCase()
        });
    }
    async getLoanDetail(id) {
        this.validateId(id);
        const loan = await this.loanRepository.findById(id);
        if (!loan) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un préstamo con identificador ${id}.`);
        }
        return loan;
    }
    async acceptLoan(id) {
        this.validateId(id);
        const updatedLoan = await this.loanRepository.updateStatus(id, 'PENDIENTE_APROBACION', 'APROBADO_Y_FIRMADO');
        if (updatedLoan) {
            return updatedLoan;
        }
        const currentLoan = await this.loanRepository.findById(id);
        if (!currentLoan) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un préstamo con identificador ${id}.`);
        }
        throw new domain_error_1.DomainError('CONFLICT', 'El préstamo ya fue aceptado y no puede aceptarse nuevamente.');
    }
    validateId(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El identificador del préstamo debe ser un entero positivo.');
        }
    }
    isUuid(value) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }
}
exports.LoanService = LoanService;
