import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaActividadComponent } from './consulta-actividad.component';

describe('ConsultaActividadComponent', () => {
  let component: ConsultaActividadComponent;
  let fixture: ComponentFixture<ConsultaActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaActividadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
