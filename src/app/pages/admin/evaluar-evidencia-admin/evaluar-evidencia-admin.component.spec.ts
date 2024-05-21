import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarEvidenciaAdminComponent } from './evaluar-evidencia-admin.component';

describe('EvaluarEvidenciaAdminComponent', () => {
  let component: EvaluarEvidenciaAdminComponent;
  let fixture: ComponentFixture<EvaluarEvidenciaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluarEvidenciaAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluarEvidenciaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
