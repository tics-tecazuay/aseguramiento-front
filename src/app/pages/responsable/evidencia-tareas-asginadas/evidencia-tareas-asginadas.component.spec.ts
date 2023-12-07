import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaTareasAsginadasComponent } from './evidencia-tareas-asginadas.component';

describe('EvidenciaTareasAsginadasComponent', () => {
  let component: EvidenciaTareasAsginadasComponent;
  let fixture: ComponentFixture<EvidenciaTareasAsginadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciaTareasAsginadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaTareasAsginadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
