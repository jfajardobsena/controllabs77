import { LoanService } from './services/loan.service';
import { TypeOrmLoanRepository } from './repositories/typeorm-loan.repository';

const loanRepository = new TypeOrmLoanRepository();
export const loanService = new LoanService(loanRepository);
