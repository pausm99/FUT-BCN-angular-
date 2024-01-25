import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFieldComponent } from './manage-field.component';

describe('ManageFieldComponent', () => {
  let component: ManageFieldComponent;
  let fixture: ComponentFixture<ManageFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
