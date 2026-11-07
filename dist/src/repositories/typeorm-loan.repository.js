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
            room: { id: input.roomId },
            instructor: { id: input.instructorId },
            guarda: { id: input.guardaId },
            numeroPc: input.numeroPc,
            estado: 'PENDIENTE_APROBACION',
            acceptedAt: null
        });
        const saved = await this.repository.save(entity);
        const savedWithRelations = await this.findEntityById(Number(saved.id));
        if (!savedWithRelations) {
            throw new Error('No fue posible recuperar el préstamo recién creado.');
        }
        return this.toDomain(savedWithRelations);
    }
    async findAll(filters = {}) {
        const query = this.withRelations();
        if (filters.roomId) {
            query.andWhere('LOWER(CAST(room.id AS text)) = LOWER(CAST(:roomId AS text))', {
                roomId: filters.roomId
            });
        }
        const entities = await query.getMany();
        return entities.map((entity) => this.toDomain(entity));
    }
    async findById(id) {
        const entity = await this.findEntityById(id);
        return entity ? this.toDomain(entity) : null;
    }
    async updateStatus(id, expectedStatus, status) {
        const entity = await this.findEntityById(id);
        if (!entity || entity.estado !== expectedStatus) {
            return null;
        }
        entity.estado = status;
        entity.acceptedAt = status === 'APROBADO_Y_FIRMADO' ? new Date() : entity.acceptedAt;
        const saved = await this.repository.save(entity);
        const savedWithRelations = await this.findEntityById(Number(saved.id));
        return savedWithRelations ? this.toDomain(savedWithRelations) : null;
    }
    withRelations() {
        return this.repository
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.room', 'room')
            .leftJoinAndSelect('loan.instructor', 'instructor')
            .leftJoinAndSelect('loan.guarda', 'guarda');
    }
    async findEntityById(id) {
        return this.withRelations()
            .where('loan.id = :id', { id })
            .getOne();
    }
    toDomain(entity) {
        return {
            id: Number(entity.id),
            room: {
                id: entity.room.id,
                nombre: entity.room.nombre,
                bloque: entity.room.bloque,
                capacidadPcs: entity.room.capacidadPcs,
                estado: entity.room.estado
            },
            instructor: {
                id: entity.instructor.id,
                nombre: entity.instructor.nombre,
                rol: entity.instructor.rol
            },
            guarda: {
                id: entity.guarda.id,
                nombre: entity.guarda.nombre,
                rol: entity.guarda.rol
            },
            numeroPc: entity.numeroPc,
            estado: entity.estado,
            createdAt: entity.createdAt.toISOString(),
            acceptedAt: entity.acceptedAt ? entity.acceptedAt.toISOString() : null
        };
    }
}
exports.TypeOrmLoanRepository = TypeOrmLoanRepository;
