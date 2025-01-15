import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomCardComponent } from './showroom-card.component';

describe('ShowroomCardComponent', () => {
  let component: ShowroomCardComponent;
  let fixture: ComponentFixture<ShowroomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowroomCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowroomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
