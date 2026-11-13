"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const domain_error_1 = require("../errors/domain.error");
class LoanService {
    loanRepository;
    constructor(loanRepository) {
        this.loanRepository = loanRepository;
    }
    createLoan(input) {
        return this.loanRepository.create(input);
    }
    getLoans(filters = {}) {
        return this.loanRepository.findAll(filters);
    }
    async getLoanDetail(id) {
        const loan = await this.loanRepository.findById(id);
        if (!loan) {
            throw new domain_error_1.DomainError('NOT_FOUND', `No existe un préstamo con identificador ${id}.`);
        }
        return loan;
    }
    async acceptLoan(id) {
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
}
exports.LoanService = LoanService;
