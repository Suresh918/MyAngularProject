import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {MatDialogAddNotesComponent} from './mat-dialog-add-notes.component';

describe('MatDialogAddNotesComponent', function () {
  let fixture: ComponentFixture<MatDialogAddNotesComponent>;
  let component: MatDialogAddNotesComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatDialogModule, HttpClientModule],
      declarations: [MatDialogAddNotesComponent],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: FormBuilder}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDialogAddNotesComponent);
    component = fixture.componentInstance;
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
