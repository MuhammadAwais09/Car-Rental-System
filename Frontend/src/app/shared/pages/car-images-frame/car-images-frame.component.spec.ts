import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarImagesFrameComponent } from './car-images-frame.component';

describe('CarImagesFrameComponent', () => {
  let component: CarImagesFrameComponent;
  let fixture: ComponentFixture<CarImagesFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarImagesFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarImagesFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
