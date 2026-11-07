"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmLoanRepository = void 0;
const data_source_1 = require("../config/data-source");
const loan_entity_1 = require("../entities/loan.entity");
class TypeOrmLoanRepository {
    repository;
    constructor(dataSource = data_source_1.AppDataSource) {
        this.repository = dataSource.getRepository(loan_entity_1.LoanEntity);
    }
    async create(input) {
        const entity = this.repository.create({
            ...input,
            estado: 'PENDIENTE_APROBACION',
            acceptedAt: null
        });
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async findAll(filters = {}) {
        const query = this.repository.createQueryBuilder('loan');
        if (filters.roomId) {
            query.where('LOWER(CAST(loan.roomId AS text)) = LOWER(CAST(:roomId AS text))', {
                roomId: filters.roomId
            });
        }
        const entities = await query.getMany();
        return entities.map((entity) => this.toDomain(entity));
    }
    async findById(id) {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }
    async updateStatus(id, expectedStatus, status) {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity || entity.estado !== expectedStatus) {
            return null;
        }
        entity.estado = status;
        entity.acceptedAt = status === 'APROBADO_Y_FIRMADO' ? new Date() : entity.acceptedAt;
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    toDomain(entity) {
        return {
            id: entity.id,
            roomId: entity.roomId,
            instructorId: entity.instructorId,
            guardaId: entity.guardaId,
            numeroPc: entity.numeroPc,
            estado: entity.estado,
            createdAt: entity.createdAt.toISOString(),
            acceptedAt: entity.acceptedAt ? entity.acceptedAt.toISOString() : null
        };
    }
}
exports.TypeOrmLoanRepository = TypeOrmLoanRepository;
