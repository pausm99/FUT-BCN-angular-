import { TestBed } from '@angular/core/testing';

import { AvailableReservationsService } from './available-reservations.service';

describe('AvailableReservationsService', () => {
  let service: AvailableReservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableReservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
