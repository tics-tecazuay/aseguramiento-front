import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaAtrasadaComponent } from './evidencia-atrasada.component';

describe('EvidenciaAtrasadaComponent', () => {
  let component: EvidenciaAtrasadaComponent;
  let fixture: ComponentFixture<EvidenciaAtrasadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciaAtrasadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaAtrasadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
