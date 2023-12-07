import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriteriosComponent } from './subcriterios.component';

describe('SubcriteriosComponent', () => {
  let component: SubcriteriosComponent;
  let fixture: ComponentFixture<SubcriteriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriteriosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriteriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
