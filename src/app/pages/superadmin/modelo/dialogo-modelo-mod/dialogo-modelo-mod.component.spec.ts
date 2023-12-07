import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogoModeloModComponent } from './dialogo-modelo-mod.component';



describe('DialogoModeloModComponent', () => {
  let component: DialogoModeloModComponent;
  let fixture: ComponentFixture<DialogoModeloModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoModeloModComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogoModeloModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
