"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryLoanRepository = void 0;
class InMemoryLoanRepository {
    loans = new Map();
    nextId = 1;
    async create(input) {
        const loan = {
            ...input,
            id: this.nextId++,
            estado: 'PENDIENTE_APROBACION',
            createdAt: new Date().toISOString(),
            acceptedAt: null
        };
        this.loans.set(loan.id, loan);
        return { ...loan };
    }
    async findAll(filters = {}) {
        const normalizedRoomId = filters.roomId?.toLowerCase();
        return Array.from(this.loans.values())
            .filter((loan) => !normalizedRoomId || loan.roomId.toLowerCase() === normalizedRoomId)
            .map((loan) => ({ ...loan }));
    }
    async findById(id) {
        const loan = this.loans.get(id);
        return loan ? { ...loan } : null;
    }
    async updateStatus(id, expectedStatus, status) {
        const loan = this.loans.get(id);
        if (!loan || loan.estado !== expectedStatus) {
            return null;
        }
        const updated = {
            ...loan,
            estado: status,
            acceptedAt: status === 'APROBADO_Y_FIRMADO'
                ? new Date().toISOString()
                : loan.acceptedAt
        };
        this.loans.set(id, updated);
        return { ...updated };
    }
}
exports.InMemoryLoanRepository = InMemoryLoanRepository;
