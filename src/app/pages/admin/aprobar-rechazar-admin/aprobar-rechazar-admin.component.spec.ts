import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarRechazarAdminComponent } from './aprobar-rechazar-admin.component';

describe('AprobarRechazarAdminComponent', () => {
  let component: AprobarRechazarAdminComponent;
  let fixture: ComponentFixture<AprobarRechazarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarRechazarAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobarRechazarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
