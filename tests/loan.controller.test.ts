import test from 'node:test';
import assert from 'node:assert/strict';

import { LoanController } from '../src/controllers/loan.controller';
import { DomainError } from '../src/errors/domain.error';
import { loanService } from '../src/container';

const createResponse = () => {
  let statusCode = 0;
  let body: unknown;
  const response = {
    status(code: number) {
      statusCode = code;
      return response;
    },
    json(payload: unknown) {
      body = payload;
      return response;
    }
  };

  return { response, get statusCode() { return statusCode; }, get body() { return body; } };
};

test('LoanController.createLoan forwards service errors to the next middleware', async () => {
  const originalCreateLoan = (loanService as any).createLoan;

  (loanService as any).createLoan = async () => {
    throw new DomainError('VALIDATION_ERROR', 'Préstamo inválido');
  };

  const req = {
    body: {
      roomId: '2f6d7bd2-3b8d-4d50-b3f6-d8070d0a7f0d',
      instructorId: 'd9c99f64-73ec-4af8-9f79-8658d5f9fe8c',
      guardaId: '924f3005-c6af-4b7a-b0d3-b6d7edb711ac',
      numeroPc: 5
    }
  } as any;

  const res = {
    status: () => res,
    json: () => undefined
  } as any;

  const errors: unknown[] = [];
  const next = (error: unknown) => {
    errors.push(error);
  };

  await LoanController.createLoan(req, res, next);

  assert.equal(errors.length, 1);
  assert.ok(errors[0] instanceof DomainError);
  assert.equal((errors[0] as DomainError).code, 'VALIDATION_ERROR');

  (loanService as any).createLoan = originalCreateLoan;
});

test('LoanController returns a success message for each successful endpoint', async () => {
  const originalMethods = {
    createLoan: loanService.createLoan,
    getLoans: loanService.getLoans,
    getLoanDetail: loanService.getLoanDetail,
    acceptLoan: loanService.acceptLoan
  };
  const loan = {
    id: 1,
    roomId: '2f6d7bd2-3b8d-4d50-b3f6-d8070d0a7f0d',
    instructorId: 'd9c99f64-73ec-4af8-9f79-8658d5f9fe8c',
    guardaId: '924f3005-c6af-4b7a-b0d3-b6d7edb711ac',
    numeroPc: 5,
    estado: 'PENDIENTE_APROBACION',
    createdAt: '2026-11-07T00:00:00.000Z',
    acceptedAt: null
  };
  const next = (error?: unknown) => {
    if (error) throw error;
  };

  try {
    (loanService as any).createLoan = async () => loan;
    (loanService as any).getLoans = async () => [loan];
    (loanService as any).getLoanDetail = async () => loan;
    (loanService as any).acceptLoan = async () => ({
      ...loan,
      estado: 'APROBADO_Y_FIRMADO',
      acceptedAt: '2026-11-07T00:00:00.000Z'
    });

    const createResponseCapture = createResponse();
    await LoanController.createLoan(
      { body: loan } as any,
      createResponseCapture.response as any,
      next
    );
    assert.equal(createResponseCapture.statusCode, 201);
    assert.equal((createResponseCapture.body as any).message, 'Préstamo registrado correctamente.');

    const listResponseCapture = createResponse();
    await LoanController.getLoansByFilter(
      { query: {} } as any,
      listResponseCapture.response as any,
      next
    );
    assert.equal(listResponseCapture.statusCode, 200);
    assert.equal((listResponseCapture.body as any).message, 'Préstamos consultados correctamente.');

    const detailResponseCapture = createResponse();
    await LoanController.getLoanById(
      { params: { id: '1' } } as any,
      detailResponseCapture.response as any,
      next
    );
    assert.equal(detailResponseCapture.statusCode, 200);
    assert.equal((detailResponseCapture.body as any).message, 'Préstamo consultado correctamente.');

    const acceptResponseCapture = createResponse();
    await LoanController.acceptLoanInventory(
      { params: { id: '1' } } as any,
      acceptResponseCapture.response as any,
      next
    );
    assert.equal(acceptResponseCapture.statusCode, 200);
    assert.equal((acceptResponseCapture.body as any).message, 'Préstamo aceptado exitosamente.');
  } finally {
    Object.assign(loanService, originalMethods);
  }
});
