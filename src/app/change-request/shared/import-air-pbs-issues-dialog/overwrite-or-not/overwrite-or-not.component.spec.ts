import { ComponentFixture, TestBed } from '@angular/core/testing';
import {OverwriteOrNotComponent} from './overwrite-or-not.component';



describe('OverwriteOrNotComponent', () => {
  let component: OverwriteOrNotComponent;
  let fixture: ComponentFixture<OverwriteOrNotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverwriteOrNotComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteOrNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
