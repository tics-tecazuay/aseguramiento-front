import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalucionComponent } from './evalucion.component';

describe('EvalucionComponent', () => {
  let component: EvalucionComponent;
  let fixture: ComponentFixture<EvalucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvalucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvalucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
