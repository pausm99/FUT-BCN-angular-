import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { manageFieldGuard } from './manage-field.guard';

describe('manageFieldGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => manageFieldGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
