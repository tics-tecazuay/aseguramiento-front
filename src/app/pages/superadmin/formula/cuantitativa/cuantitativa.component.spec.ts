import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuantitativaComponent } from './cuantitativa.component';

describe('CuantitativaComponent', () => {
  let component: CuantitativaComponent;
  let fixture: ComponentFixture<CuantitativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuantitativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuantitativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
