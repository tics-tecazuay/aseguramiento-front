import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResponsablesComponent } from './email-responsables.component';

describe('EmailResponsablesComponent', () => {
  let component: EmailResponsablesComponent;
  let fixture: ComponentFixture<EmailResponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailResponsablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailResponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
