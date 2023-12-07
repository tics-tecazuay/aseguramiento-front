import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaComponent } from './asigna.component';

describe('AsignaComponent', () => {
  let component: AsignaComponent;
  let fixture: ComponentFixture<AsignaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
