import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailbleCarForRentComponent } from './availble-car-for-rent.component';

describe('AvailbleCarForRentComponent', () => {
  let component: AvailbleCarForRentComponent;
  let fixture: ComponentFixture<AvailbleCarForRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailbleCarForRentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailbleCarForRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
