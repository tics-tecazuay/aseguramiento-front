import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonderacionIndicadorComponent } from './ponderacion-indicador.component';

describe('PonderacionIndicadorComponent', () => {
  let component: PonderacionIndicadorComponent;
  let fixture: ComponentFixture<PonderacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonderacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonderacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
