import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterioReporteComponent } from './criterio-reporte.component';

describe('CriterioReporteComponent', () => {
  let component: CriterioReporteComponent;
  let fixture: ComponentFixture<CriterioReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterioReporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriterioReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
