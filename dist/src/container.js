"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanService = void 0;
const loan_service_1 = require("./services/loan.service");
const typeorm_loan_repository_1 = require("./repositories/typeorm-loan.repository");
const loanRepository = new typeorm_loan_repository_1.TypeOrmLoanRepository();
exports.loanService = new loan_service_1.LoanService(loanRepository);
