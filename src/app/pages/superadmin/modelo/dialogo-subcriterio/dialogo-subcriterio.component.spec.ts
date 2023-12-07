import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSubcriterioComponent } from './dialogo-subcriterio.component';

describe('DialogoSubcriterioComponent', () => {
  let component: DialogoSubcriterioComponent;
  let fixture: ComponentFixture<DialogoSubcriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoSubcriterioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoSubcriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
