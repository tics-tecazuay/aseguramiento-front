import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonderacionModeloComponent } from './ponderacion-modelo.component';

describe('PonderacionModeloComponent', () => {
  let component: PonderacionModeloComponent;
  let fixture: ComponentFixture<PonderacionModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonderacionModeloComponent ]
    })
    .compileComponents();


    fixture =  TestBed.createComponent(PonderacionModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
