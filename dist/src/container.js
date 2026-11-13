"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanService = void 0;
const loan_service_1 = require("./services/loan.service");
const prisma_loan_repository_1 = require("./repositories/prisma-loan.repository");
const prisma_1 = require("./db/prisma");
const loanRepository = new prisma_loan_repository_1.PrismaLoanRepository(prisma_1.prisma);
exports.loanService = new loan_service_1.LoanService(loanRepository);
