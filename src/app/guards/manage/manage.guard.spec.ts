import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { manageGuard } from './manage.guard';

describe('manageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => manageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
