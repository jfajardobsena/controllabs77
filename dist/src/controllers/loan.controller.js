"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const container_1 = require("../container");
class LoanController {
    static createLoan = async (req, res, next) => {
        try {
            const loan = await container_1.loanService.createLoan(req.body);
            res.status(201).json({ success: true, data: loan });
        }
        catch (error) {
            next(error);
        }
    };
    static getLoansByFilter = async (req, res, next) => {
        try {
            const { roomId } = req.query;
            const loans = await container_1.loanService.getLoans({ roomId });
            res.status(200).json({ success: true, data: loans });
        }
        catch (error) {
            next(error);
        }
    };
    static getLoanById = async (req, res, next) => {
        try {
            const loan = await container_1.loanService.getLoanDetail(req.params.id);
            res.status(200).json({ success: true, data: loan });
        }
        catch (error) {
            next(error);
        }
    };
    static acceptLoanInventory = async (req, res, next) => {
        try {
            const loan = await container_1.loanService.acceptLoan(req.params.id);
            res.status(200).json({ success: true, data: loan });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LoanController = LoanController;
