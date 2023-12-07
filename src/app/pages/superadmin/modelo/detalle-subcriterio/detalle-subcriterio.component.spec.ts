import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSubcriterioComponent } from './detalle-subcriterio.component';

describe('DetalleSubcriterioComponent', () => {
  let component: DetalleSubcriterioComponent;
  let fixture: ComponentFixture<DetalleSubcriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSubcriterioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSubcriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
