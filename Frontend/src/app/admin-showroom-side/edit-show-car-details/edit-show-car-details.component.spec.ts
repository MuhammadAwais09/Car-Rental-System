import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowCarDetailsComponent } from './edit-show-car-details.component';

describe('EditShowCarDetailsComponent', () => {
  let component: EditShowCarDetailsComponent;
  let fixture: ComponentFixture<EditShowCarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShowCarDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShowCarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
