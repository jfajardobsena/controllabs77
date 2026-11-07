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
      ...input,
      estado: 'PENDIENTE_APROBACION',
      acceptedAt: null
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  public async findAll(filters: LoanFilters = {}): Promise<Loan[]> {
    const query = this.repository.createQueryBuilder('loan');

    if (filters.roomId) {
      query.where('LOWER(CAST(loan.roomId AS text)) = LOWER(CAST(:roomId AS text))', {
        roomId: filters.roomId
      });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toDomain(entity));
  }

  public async findById(id: number): Promise<Loan | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  public async updateStatus(
    id: number,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity || entity.estado !== expectedStatus) {
      return null;
    }

    entity.estado = status;
    entity.acceptedAt = status === 'APROBADO_Y_FIRMADO' ? new Date() : entity.acceptedAt;

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: LoanEntity): Loan {
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
