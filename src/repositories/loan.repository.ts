import { ICreateLoanDTO } from '../dtos/loan.dto';
import type { LoanStatus, RoomStatus, UserRole } from '../models/loan.types';

export type { LoanStatus } from '../models/loan.types';

export interface LoanRoom {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: RoomStatus;
}

export interface LoanUser {
  id: string;
  nombre: string;
  rol: UserRole;
}

export interface Loan {
  id: number;
  room: LoanRoom;
  instructor: LoanUser;
  guarda: LoanUser;
  numeroPc: number;
  estado: LoanStatus;
  createdAt: string;
  acceptedAt: string | null;
}

export interface LoanFilters {
  roomId?: string;
}

export interface LoanRepository {
  create(input: ICreateLoanDTO): Promise<Loan>;
  findAll(filters?: LoanFilters): Promise<Loan[]>;
  findById(id: number): Promise<Loan | null>;
  updateStatus(id: number, expectedStatus: LoanStatus, status: LoanStatus): Promise<Loan | null>;
}
