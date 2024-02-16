import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionCriterioResponsableComponent } from './asignacion-criterio-responsable.component';

describe('AsignacionCriterioResponsableComponent', () => {
  let component: AsignacionCriterioResponsableComponent;
  let fixture: ComponentFixture<AsignacionCriterioResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionCriterioResponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionCriterioResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
