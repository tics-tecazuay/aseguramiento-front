import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonderacionfinalComponent } from './ponderacionfinal.component';

describe('PonderacionfinalComponent', () => {
  let component: PonderacionfinalComponent;
  let fixture: ComponentFixture<PonderacionfinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonderacionfinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonderacionfinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
