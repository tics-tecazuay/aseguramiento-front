import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonderacionCriterioComponent } from './ponderacion-criterio.component';

describe('PonderacionCriterioComponent', () => {
  let component: PonderacionCriterioComponent;
  let fixture: ComponentFixture<PonderacionCriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonderacionCriterioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonderacionCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
