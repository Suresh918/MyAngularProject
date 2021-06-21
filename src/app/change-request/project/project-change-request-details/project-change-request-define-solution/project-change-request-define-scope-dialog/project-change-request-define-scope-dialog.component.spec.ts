import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectChangeRequestDefineScopeDialogComponent } from './project-change-request-define-scope-dialog.component';

describe('ProjectChangeRequestDefineScopeDialogComponent', () => {
  let component: ProjectChangeRequestDefineScopeDialogComponent;
  let fixture: ComponentFixture<ProjectChangeRequestDefineScopeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestDefineScopeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestDefineScopeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
