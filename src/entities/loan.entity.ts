import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { LoanStatus } from '../repositories/loan.repository';

@Entity({ name: 'loans' })
export class LoanEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @Column({ type: 'uuid', name: 'room_id' })
  roomId!: string;

  @Column({ type: 'uuid', name: 'instructor_id' })
  instructorId!: string;

  @Column({ type: 'uuid', name: 'guarda_id' })
  guardaId!: string;

  @Column({ type: 'int', name: 'numero_pc' })
  numeroPc!: number;

  @Column({ type: 'varchar', length: 24, name: 'estado' })
  estado!: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'accepted_at', nullable: true })
  acceptedAt!: Date | null;
}
