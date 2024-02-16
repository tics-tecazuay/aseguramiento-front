import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresEvidenciaComponent } from './indicadores-evidencia.component';

describe('IndicadoresEvidenciaComponent', () => {
  let component: IndicadoresEvidenciaComponent;
  let fixture: ComponentFixture<IndicadoresEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
