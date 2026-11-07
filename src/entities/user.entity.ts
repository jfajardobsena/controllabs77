import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { UserRole } from '../models/loan.types';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id!: string;

  @Column({ type: 'varchar', length: 150, name: 'nombre' })
  nombre!: string;

  @Column({ type: 'varchar', length: 20, name: 'rol' })
  rol!: UserRole;
}