import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatMultiAssigneeGroupsComponent} from './mat-multi-assignee-groups.component';

describe('MatMultiAssigneeGroupsComponent', () => {
  let component: MatMultiAssigneeGroupsComponent;
  let fixture: ComponentFixture<MatMultiAssigneeGroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMultiAssigneeGroupsComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMultiAssigneeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
