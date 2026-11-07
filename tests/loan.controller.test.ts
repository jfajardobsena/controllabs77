import test from 'node:test';
import assert from 'node:assert/strict';

import { LoanController } from '../src/controllers/loan.controller';
import { DomainError } from '../src/errors/domain.error';
import { loanService } from '../src/container';

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
