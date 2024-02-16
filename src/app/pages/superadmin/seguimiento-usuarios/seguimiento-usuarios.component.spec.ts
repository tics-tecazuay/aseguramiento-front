import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoUsuariosComponent } from './seguimiento-usuarios.component';

describe('SeguimientoUsuariosComponent', () => {
  let component: SeguimientoUsuariosComponent;
  let fixture: ComponentFixture<SeguimientoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
