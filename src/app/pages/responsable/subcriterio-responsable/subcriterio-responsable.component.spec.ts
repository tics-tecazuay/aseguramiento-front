import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriterioResponsableComponent } from './subcriterio-responsable.component';

describe('SubcriterioResponsableComponent', () => {
  let component: SubcriterioResponsableComponent;
  let fixture: ComponentFixture<SubcriterioResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriterioResponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriterioResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
