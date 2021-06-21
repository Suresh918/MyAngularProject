import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ChangeRequestService} from '../../../change-request.service';
import {of} from 'rxjs';
import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {ProjectDefiningSolutionComponent} from './project-defining-solution.component';
import {ChangeRequest} from '../../../../shared/models/mc.model';


describe('ProjectDefiningSolutionComponent', () => {
  let component: ProjectDefiningSolutionComponent;
  let fixture: ComponentFixture<ProjectDefiningSolutionComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  const dialogMock = {
    open: () => {
    },
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDefiningSolutionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: MatDialog, useValue: dialogMock},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDefiningSolutionComponent);
    component = fixture.componentInstance;
    component.changeRequestConfiguration = {} as ChangeRequestFormConfiguration;
    component.changeRequestConfiguration['air'] = {
      help: {
        help: {
          message: 'test'
        }
      }
    };
    component.getLabelAndDescription = jasmine.createSpy().and.returnValue('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call CR documents service when changeRequestData is set', () => {
    component.changeRequestData = {id: 1} as ChangeRequest;
    const data = component.changeRequestData; // To cover changeRequestData getter function
    expect(component.documents.length).toEqual(2);
  });

  it('should trigger openImageDialog when an image is clicked', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.pictureUrl = '';
    component.documents = [{
      id: 1,
      tags: 'AS-IS-PICTURE',
      name: 'img1',
      creator: {
        full_name: 'TestUser'
      },
      created_on: 'TestDate'
    }, {
      id: 2,
      tags: 'To-BE-PICTURE',
      name: 'img2',
      creator: {
        full_name: 'TestUser'
      },
      created_on: 'TestDate'
    }];
    component.openImageDialog(1);
    expect(component.dialog.open).toHaveBeenCalled();
  });
});

class ChangeRequestServiceMock {
  getChangeRequestDocuments(id, tag) {
    return of([{id: 2}]);
  }
}
