import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { LoanEntity } from '../entities/loan.entity';
import { Loan, LoanFilters, LoanRepository, LoanStatus } from './loan.repository';

export class TypeOrmLoanRepository implements LoanRepository {
  private readonly repository: Repository<LoanEntity>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.repository = dataSource.getRepository(LoanEntity);
  }

  public async create(input: ICreateLoanDTO): Promise<Loan> {
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

  public async findAll(filters: LoanFilters = {}): Promise<Loan[]> {
    const query = this.withRelations();

    if (filters.roomId) {
      query.andWhere('LOWER(CAST(room.id AS text)) = LOWER(CAST(:roomId AS text))', {
        roomId: filters.roomId
      });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toDomain(entity));
  }

  public async findById(id: number): Promise<Loan | null> {
    const entity = await this.findEntityById(id);
    return entity ? this.toDomain(entity) : null;
  }

  public async updateStatus(
    id: number,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null> {
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

  private withRelations() {
    return this.repository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.room', 'room')
      .leftJoinAndSelect('loan.instructor', 'instructor')
      .leftJoinAndSelect('loan.guarda', 'guarda');
  }

  private async findEntityById(id: number): Promise<LoanEntity | null> {
    return this.withRelations()
      .where('loan.id = :id', { id })
      .getOne();
  }

  private toDomain(entity: LoanEntity): Loan {
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
