import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosSubcriterioComponent } from './criterios-subcriterio.component';

describe('CriteriosSubcriterioComponent', () => {
  let component: CriteriosSubcriterioComponent;
  let fixture: ComponentFixture<CriteriosSubcriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriteriosSubcriterioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriosSubcriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
