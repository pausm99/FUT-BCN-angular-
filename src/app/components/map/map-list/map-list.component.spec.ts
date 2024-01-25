import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapListComponent } from './map-list.component';

describe('MapListComponent', () => {
  let component: MapListComponent;
  let fixture: ComponentFixture<MapListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
