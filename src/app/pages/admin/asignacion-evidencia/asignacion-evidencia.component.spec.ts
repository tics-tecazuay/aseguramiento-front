import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionEvidenciaComponent } from './asignacion-evidencia.component';

describe('AsignacionEvidenciaComponent', () => {
  let component: AsignacionEvidenciaComponent;
  let fixture: ComponentFixture<AsignacionEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
