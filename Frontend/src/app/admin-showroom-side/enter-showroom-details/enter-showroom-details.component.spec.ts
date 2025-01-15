import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterShowroomDetailsComponent } from './enter-showroom-details.component';

describe('EnterShowroomDetailsComponent', () => {
  let component: EnterShowroomDetailsComponent;
  let fixture: ComponentFixture<EnterShowroomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterShowroomDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterShowroomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
