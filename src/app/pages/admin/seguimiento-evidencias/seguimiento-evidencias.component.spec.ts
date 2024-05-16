import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoEvidenciasComponent } from './seguimiento-evidencias.component';

describe('SeguimientoEvidenciasComponent', () => {
  let component: SeguimientoEvidenciasComponent;
  let fixture: ComponentFixture<SeguimientoEvidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoEvidenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoEvidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
