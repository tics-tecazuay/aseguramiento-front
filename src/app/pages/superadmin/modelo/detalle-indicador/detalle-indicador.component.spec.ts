import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIndicadorComponent } from './detalle-indicador.component';

describe('DetalleIndicadorComponent', () => {
  let component: DetalleIndicadorComponent;
  let fixture: ComponentFixture<DetalleIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
