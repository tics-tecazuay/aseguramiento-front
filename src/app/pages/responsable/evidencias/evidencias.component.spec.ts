import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenciasComponent } from '../../superadmin/pages/evidencias/evidencias.component';


describe('EvidenciasComponent', () => {
  let component: EvidenciasComponent;
  let fixture: ComponentFixture<EvidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidenciasComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EvidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
