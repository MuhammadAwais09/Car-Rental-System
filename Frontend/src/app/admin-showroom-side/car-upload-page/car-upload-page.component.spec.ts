import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarUploadPageComponent } from './car-upload-page.component';

describe('CarUploadPageComponent', () => {
  let component: CarUploadPageComponent;
  let fixture: ComponentFixture<CarUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarUploadPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
