import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorDefineScopeDialogInfoComponent } from './creator-define-scope-dialog-info.component';

describe('CreatorDefineScopeDialogInfoComponent', () => {
  let component: CreatorDefineScopeDialogInfoComponent;
  let fixture: ComponentFixture<CreatorDefineScopeDialogInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorDefineScopeDialogInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorDefineScopeDialogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit onConfirm when onProceed is clicked', () => {
    spyOn(component.onConfirm, 'emit');
    component.onProceed();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });
  it('should emit onCancel when onClose is clicked', () => {
    spyOn(component.onCancel, 'emit');
    component.onClose();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });
});
