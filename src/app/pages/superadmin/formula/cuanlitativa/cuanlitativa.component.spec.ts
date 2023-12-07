import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuanlitativaComponent } from './cuanlitativa.component';

describe('CuanlitativaComponent', () => {
  let component: CuanlitativaComponent;
  let fixture: ComponentFixture<CuanlitativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuanlitativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuanlitativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
