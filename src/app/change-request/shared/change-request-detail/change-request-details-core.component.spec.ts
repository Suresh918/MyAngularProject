import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ChangeRequestDetailsCoreComponent} from './change-request-details-core.component';




describe('ChangeRequestDetailsCoreComponent', () => {
  let component: ChangeRequestDetailsCoreComponent;
  let fixture: ComponentFixture<ChangeRequestDetailsCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDetailsCoreComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestDetailsCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
