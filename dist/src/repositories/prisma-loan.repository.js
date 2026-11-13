"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLoanRepository = void 0;
const client_1 = require("@prisma/client");
const domain_error_1 = require("../errors/domain.error");
const toLoanStatus = (value) => {
    if (value === 'PENDIENTE_APROBACION' || value === 'APROBADO_Y_FIRMADO') {
        return value;
    }
    throw new Error(`Estado de préstamo no reconocido en la base de datos: ${value}`);
};
class PrismaLoanRepository {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(input) {
        try {
            const loan = await this.database.loan.create({
                data: {
                    roomId: input.roomId,
                    instructorId: input.instructorId,
                    guardaId: input.guardaId,
                    numeroPc: input.numeroPc
                }
            });
            return this.toDomain(loan);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003') {
                throw new domain_error_1.DomainError('VALIDATION_ERROR', 'La sala, el instructor o el guarda indicados no existen.');
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2004') {
                throw new domain_error_1.DomainError('VALIDATION_ERROR', 'Los datos del préstamo incumplen una restricción de la base de datos.');
            }
            throw error;
        }
    }
    async findAll(filters = {}) {
        const loans = await this.database.loan.findMany({
            where: filters.roomId ? { roomId: filters.roomId } : undefined,
            orderBy: { createdAt: 'desc' }
        });
        return loans.map((loan) => this.toDomain(loan));
    }
    async findById(id) {
        const loan = await this.database.loan.findUnique({
            where: { id: BigInt(id) }
        });
        return loan ? this.toDomain(loan) : null;
    }
    async updateStatus(id, expectedStatus, status) {
        const result = await this.database.loan.updateMany({
            where: {
                id: BigInt(id),
                estado: expectedStatus
            },
            data: {
                estado: status,
                acceptedAt: status === 'APROBADO_Y_FIRMADO' ? new Date() : null
            }
        });
        return result.count === 0 ? null : this.findById(id);
    }
    toDomain(loan) {
        return {
            id: loan.id.toString(),
            roomId: loan.roomId,
            instructorId: loan.instructorId,
            guardaId: loan.guardaId,
            numeroPc: loan.numeroPc,
            estado: toLoanStatus(loan.estado),
            createdAt: loan.createdAt.toISOString(),
            acceptedAt: loan.acceptedAt?.toISOString() ?? null
        };
    }
}
exports.PrismaLoanRepository = PrismaLoanRepository;
