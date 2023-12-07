import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadAutoridadComponent } from './actividad-autoridad.component';

describe('ActividadAutoridadComponent', () => {
  let component: ActividadAutoridadComponent;
  let fixture: ComponentFixture<ActividadAutoridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadAutoridadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadAutoridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
