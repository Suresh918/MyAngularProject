import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {Router, RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {Store, StoreModule} from '@ngrx/store';
import {of, throwError} from 'rxjs';

import { ObjectLinkComponent } from './object-link.component';
import { ServiceParametersService } from '../../../core/services/service-parameters.service';
import { ReleasePackage } from '../../models/mc.model';
import { TeamCenterService } from '../../../core/services/team-center.service';
import {metaReducers, reducers} from '../../../store';
import {FormBuilder} from '@angular/forms';

describe('ObjectLinkComponent',  () => {
  let fixture: ComponentFixture<ObjectLinkComponent>;
  let component: ObjectLinkComponent;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ObjectLinkComponent],
      imports: [HttpClientModule, MatDialogModule, RouterModule, RouterTestingModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {
          provide: Store,
          useValue: jasmine.createSpyObj('Store', ['dispatch', 'pipe']),
        },
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: TeamCenterService, useClass: TeamCenterServiceMock},
        {provide: Router, useValue: mockRouter},
        FormBuilder
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ObjectLinkComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDelta1Report when openLink is triggered', () => {
    spyOn(component, 'getDelta1Report');
    component.openLink('Source', new ReleasePackage());
    component.openLink('Report', new ReleasePackage());
    expect(component.getDelta1Report).toHaveBeenCalled();
  });

  it('should navigate when openLink is triggered', () => {
    const releasePackage = new ReleasePackage({ID: '1234356'} as ReleasePackage);
    component.openLink('Release Package', releasePackage);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should return empty when openLink is triggered key as empty', () => {
    const releasePackage = new ReleasePackage({ID: '1234356'} as ReleasePackage);
    const returnValue = component.openLink('', releasePackage);
    expect(returnValue).toBe(undefined);
  });

  it('should open window when openDeltaURL is triggered',  () => {
    spyOn(window, 'open');
    const releasePackage = new ReleasePackage({ID: '1234356', sourceSystemAliasID: '67899'} as ReleasePackage);
    component.openDeltaURL(releasePackage);
    expect(window.open).toHaveBeenCalled();
  });

  it('should open window when getDelta1Report is triggered',  () => {
    spyOn(window, 'open');
    component.delta1URL = 'url-{DELTA-REPORT-ID}-{EXCEL-REFERENCE-ID}';
    const releasePackage = new ReleasePackage({ID: '1234356', sourceSystemAliasID: '67899'} as ReleasePackage);
    component.getDelta1Report(releasePackage);
    expect(window.open).toHaveBeenCalled();
  });

  it('should set inlineProgressBar  to false when getDelta1Report on triggered', () => {
    const xService = fixture.debugElement.injector.get(TeamCenterService);
    spyOn(xService, 'getDelta1ObjectId').and.returnValue(throwError(new Error('message')));
    const releasePackage = new ReleasePackage({ID: '1234356', sourceSystemAliasID: '67899'} as ReleasePackage);
    component.getDelta1Report(releasePackage);
    expect(component.inlineProgressBar).toBe(false);
  });
});

class ServiceParametersServiceMock {
  getServiceParameter() {
    return [{ 'name': 'name1' }];
  }
}
class TeamCenterServiceMock {
  getDelta1ObjectId() {
    return of({ 'deltaReportID': '123', 'ref': [{type: 'excel', ID: '23433'}] });
  }
}
