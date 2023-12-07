import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriteriosAdminComponent } from './subcriterios-admin.component';

describe('SubcriteriosAdminComponent', () => {
  let component: SubcriteriosAdminComponent;
  let fixture: ComponentFixture<SubcriteriosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriteriosAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriteriosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
