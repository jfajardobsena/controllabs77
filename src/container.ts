import { LoanService } from './services/loan.service';
import { InMemoryLoanRepository } from './repositories/in-memory-loan.repository';

export const loanService = new LoanService(new InMemoryLoanRepository());
