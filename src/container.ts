import { LoanService } from './services/loan.service';
import { InMemoryLoanRepository } from './repositories/in-memory-loan.repository';
import { TypeOrmLoanRepository } from './repositories/typeorm-loan.repository';

const loanRepository =
  process.env.DB_TYPE === 'postgres'
    ? new TypeOrmLoanRepository()
    : new InMemoryLoanRepository();

export const loanService = new LoanService(loanRepository);
