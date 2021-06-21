import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ProjectDefineScopeDialogInfoComponent} from './project-define-scope-dialog-info.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ProjectDefineScopeDialogInfoComponent', () => {
  let component: ProjectDefineScopeDialogInfoComponent;
  let fixture: ComponentFixture<ProjectDefineScopeDialogInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDefineScopeDialogInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDefineScopeDialogInfoComponent);
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
