import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFieldComponent } from './reservation-field.component';

describe('ReservationFieldComponent', () => {
  let component: ReservationFieldComponent;
  let fixture: ComponentFixture<ReservationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
