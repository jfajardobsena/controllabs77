"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const domain_error_1 = require("../errors/domain.error");
const container_1 = require("../container");
class LoanController {
    static createLoan = async (req, res) => {
        const loan = await container_1.loanService.createLoan(req.body);
        res.status(201).json({ success: true, data: loan });
    };
    static getLoansByFilter = async (req, res) => {
        const { roomId } = req.query;
        if (roomId !== undefined && typeof roomId !== 'string') {
            throw new domain_error_1.DomainError('VALIDATION_ERROR', 'El filtro roomId debe ser un texto.');
        }
        const loans = await container_1.loanService.getLoans({ roomId });
        res.status(200).json({ success: true, data: loans });
    };
    static getLoanById = async (req, res) => {
        const loan = await container_1.loanService.getLoanDetail(Number(req.params.id));
        res.status(200).json({ success: true, data: loan });
    };
    static acceptLoanInventory = async (req, res) => {
        const loan = await container_1.loanService.acceptLoan(Number(req.params.id));
        res.status(200).json({ success: true, data: loan });
    };
}
exports.LoanController = LoanController;
