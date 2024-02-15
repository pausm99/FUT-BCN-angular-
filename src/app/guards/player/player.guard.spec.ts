import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { playerGuard } from './player.guard';

describe('playerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => playerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
