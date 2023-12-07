import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogoModeloComponent } from './dialogo-modelo.component';



describe('DialogoModeloComponent', () => {
  let component: DialogoModeloComponent;
  let fixture: ComponentFixture<DialogoModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoModeloComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogoModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
