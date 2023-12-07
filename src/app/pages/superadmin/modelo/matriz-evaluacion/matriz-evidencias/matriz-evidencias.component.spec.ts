import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizEvidenciasComponent } from './matriz-evidencias.component';

describe('MatrizEvidenciasComponent', () => {
  let component: MatrizEvidenciasComponent;
  let fixture: ComponentFixture<MatrizEvidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizEvidenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizEvidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
