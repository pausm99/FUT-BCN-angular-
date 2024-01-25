import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointerComponent } from './map-pointer.component';

describe('MapPointerComponent', () => {
  let component: MapPointerComponent;
  let fixture: ComponentFixture<MapPointerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPointerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPointerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
