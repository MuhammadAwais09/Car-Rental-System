import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRentCarDetailsComponent } from './selected-rent-car-details.component';

describe('SelectedRentCarDetailsComponent', () => {
  let component: SelectedRentCarDetailsComponent;
  let fixture: ComponentFixture<SelectedRentCarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedRentCarDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedRentCarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
