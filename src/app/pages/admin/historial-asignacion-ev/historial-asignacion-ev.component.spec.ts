import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAsignacionEvComponent } from './historial-asignacion-ev.component';

describe('HistorialAsignacionEvComponent', () => {
  let component: HistorialAsignacionEvComponent;
  let fixture: ComponentFixture<HistorialAsignacionEvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAsignacionEvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAsignacionEvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
