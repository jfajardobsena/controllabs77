import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { LoanStatus } from '../repositories/loan.repository';

@Entity({ name: 'loans' })
export class LoanEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid' })
  instructorId!: string;

  @Column({ type: 'uuid' })
  guardaId!: string;

  @Column({ type: 'int' })
  numeroPc!: number;

  @Column({ type: 'varchar', length: 50 })
  estado!: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt!: Date | null;
}
