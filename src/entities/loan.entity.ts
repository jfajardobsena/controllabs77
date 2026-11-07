import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import type { LoanStatus } from '../models/loan.types';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'loans' })
export class LoanEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: number;

  @ManyToOne(() => RoomEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room!: RoomEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'instructor_id', referencedColumnName: 'id' })
  instructor!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'guarda_id', referencedColumnName: 'id' })
  guarda!: UserEntity;

  @Column({ type: 'int', name: 'numero_pc' })
  numeroPc!: number;

  @Column({ type: 'varchar', length: 24, name: 'estado' })
  estado!: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'accepted_at', nullable: true })
  acceptedAt!: Date | null;
}
