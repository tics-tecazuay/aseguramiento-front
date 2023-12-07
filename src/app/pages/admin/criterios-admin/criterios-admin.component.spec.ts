import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosAdminComponent } from './criterios-admin.component';

describe('CriteriosAdminComponent', () => {
  let component: CriteriosAdminComponent;
  let fixture: ComponentFixture<CriteriosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriteriosAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
