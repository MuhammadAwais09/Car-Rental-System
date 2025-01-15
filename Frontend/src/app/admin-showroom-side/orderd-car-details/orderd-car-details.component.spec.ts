import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdCarDetailsComponent } from './orderd-car-details.component';

describe('OrderdCarDetailsComponent', () => {
  let component: OrderdCarDetailsComponent;
  let fixture: ComponentFixture<OrderdCarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdCarDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderdCarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
