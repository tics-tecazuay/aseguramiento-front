import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogoCriterioComponent } from './dialogo-criterio.component';


describe('DialogoCriterioComponent', () => {
  let component: DialogoCriterioComponent;
  let fixture: ComponentFixture<DialogoCriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoCriterioComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogoCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
