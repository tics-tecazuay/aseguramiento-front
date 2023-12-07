import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionCuantitativaComponent } from './evaluacion-cuantitativa.component';

describe('EvaluacionCuantitativaComponent', () => {
  let component: EvaluacionCuantitativaComponent;
  let fixture: ComponentFixture<EvaluacionCuantitativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionCuantitativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionCuantitativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
