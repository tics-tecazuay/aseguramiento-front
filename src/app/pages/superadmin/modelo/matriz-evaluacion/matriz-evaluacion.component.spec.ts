import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizEvaluacionComponent } from './matriz-evaluacion.component';

describe('MatrizEvaluacionComponent', () => {
  let component: MatrizEvaluacionComponent;
  let fixture: ComponentFixture<MatrizEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
