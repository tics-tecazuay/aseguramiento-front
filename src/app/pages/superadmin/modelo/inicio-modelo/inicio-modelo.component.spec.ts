import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioModeloComponent } from './inicio-modelo.component';

describe('InicioModeloComponent', () => {
  let component: InicioModeloComponent;
  let fixture: ComponentFixture<InicioModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
