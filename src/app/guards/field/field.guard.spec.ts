import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { fieldGuard } from './field.guard';

describe('fieldGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => fieldGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
