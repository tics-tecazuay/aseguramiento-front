import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriteriosIndicadorComponent } from './subcriterios-indicador.component';

describe('SubcriteriosIndicadorComponent', () => {
  let component: SubcriteriosIndicadorComponent;
  let fixture: ComponentFixture<SubcriteriosIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriteriosIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriteriosIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
