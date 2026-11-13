import { LoanService } from './services/loan.service';
import { PrismaLoanRepository } from './repositories/prisma-loan.repository';
import { prisma } from './db/prisma';

const loanRepository = new PrismaLoanRepository(prisma);
export const loanService = new LoanService(loanRepository);
