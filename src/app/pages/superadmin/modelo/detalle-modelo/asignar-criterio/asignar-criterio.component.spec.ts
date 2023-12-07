import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCriterioComponent } from './asignar-criterio.component';

describe('AsignarCriterioComponent', () => {
  let component: AsignarCriterioComponent;
  let fixture: ComponentFixture<AsignarCriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarCriterioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
