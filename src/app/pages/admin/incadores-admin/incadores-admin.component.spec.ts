import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncadoresAdminComponent } from './incadores-admin.component';

describe('IncadoresAdminComponent', () => {
  let component: IncadoresAdminComponent;
  let fixture: ComponentFixture<IncadoresAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncadoresAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncadoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
