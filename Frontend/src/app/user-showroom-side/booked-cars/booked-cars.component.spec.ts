import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedCarsComponent } from './booked-cars.component';

describe('BookedCarsComponent', () => {
  let component: BookedCarsComponent;
  let fixture: ComponentFixture<BookedCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookedCarsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
