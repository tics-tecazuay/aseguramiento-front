import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterioReporteAdmComponent } from './criterio-reporte-adm.component';

describe('CriterioReporteAdmComponent', () => {
  let component: CriterioReporteAdmComponent;
  let fixture: ComponentFixture<CriterioReporteAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterioReporteAdmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriterioReporteAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
