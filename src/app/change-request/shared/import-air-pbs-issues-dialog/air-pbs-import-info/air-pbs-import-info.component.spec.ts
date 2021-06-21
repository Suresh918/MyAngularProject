import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AirPbsImportInfoComponent} from './air-pbs-import-info.component';



describe('AirPbsImportInfoComponent', () => {
  let component: AirPbsImportInfoComponent;
  let fixture: ComponentFixture<AirPbsImportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirPbsImportInfoComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirPbsImportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when Proceed is clicked', () => {
    spyOn(component.onConfirm, 'emit');
    component.onProceed();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });

  it('should emit event when Cancel is clicked', () => {
    spyOn(component.onCancel, 'emit');
    component.onClose();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });
});
