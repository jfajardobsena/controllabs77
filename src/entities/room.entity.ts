import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { RoomStatus } from '../models/loan.types';

@Entity({ name: 'rooms' })
export class RoomEntity {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id!: string;

  @Column({ type: 'varchar', length: 100, name: 'nombre' })
  nombre!: string;

  @Column({ type: 'varchar', length: 50, name: 'bloque' })
  bloque!: string;

  @Column({ type: 'int', name: 'capacidad_pcs' })
  capacidadPcs!: number;

  @Column({ type: 'varchar', length: 20, name: 'estado' })
  estado!: RoomStatus;
}