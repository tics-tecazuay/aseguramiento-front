import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarIndicarComponent } from './calificar-indicar.component';

describe('CalificarIndicarComponent', () => {
  let component: CalificarIndicarComponent;
  let fixture: ComponentFixture<CalificarIndicarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarIndicarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificarIndicarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
