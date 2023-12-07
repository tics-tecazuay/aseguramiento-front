/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Historial_notifiComponent } from './historial_notifi.component';

describe('Historial_notifiComponent', () => {
  let component: Historial_notifiComponent;
  let fixture: ComponentFixture<Historial_notifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Historial_notifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Historial_notifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
