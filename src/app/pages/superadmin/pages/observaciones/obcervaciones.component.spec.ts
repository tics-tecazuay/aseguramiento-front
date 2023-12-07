import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObcervacionesComponent } from './obcervaciones.component';

describe('ObcervacionesComponent', () => {
  let component: ObcervacionesComponent;
  let fixture: ComponentFixture<ObcervacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObcervacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObcervacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
