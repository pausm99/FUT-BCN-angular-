import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReservationsComponent } from './user-reservations.component';

describe('UserReservationsComponent', () => {
  let component: UserReservationsComponent;
  let fixture: ComponentFixture<UserReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReservationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
