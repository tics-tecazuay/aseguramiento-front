import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarRechazarDetalleAdminComponent } from './aprobar-rechazar-detalle-admin.component';

describe('AprobarRechazarDetalleAdminComponent', () => {
  let component: AprobarRechazarDetalleAdminComponent;
  let fixture: ComponentFixture<AprobarRechazarDetalleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarRechazarDetalleAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobarRechazarDetalleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
