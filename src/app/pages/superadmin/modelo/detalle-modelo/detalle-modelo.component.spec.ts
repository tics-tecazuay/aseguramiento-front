import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleModeloComponent } from './detalle-modelo.component';

describe('DetalleModeloComponent', () => {
  let component: DetalleModeloComponent;
  let fixture: ComponentFixture<DetalleModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
