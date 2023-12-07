import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesResponsableComponent } from './actividades-responsable.component';

describe('ActividadesResponsableComponent', () => {
  let component: ActividadesResponsableComponent;
  let fixture: ComponentFixture<ActividadesResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadesResponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
