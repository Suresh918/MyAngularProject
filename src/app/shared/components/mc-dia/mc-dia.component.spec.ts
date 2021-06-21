import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';

import {MCDiaComponent} from './mc-dia.component';
import {MCButtonContainedComponent} from '../mc-button-contained/mc-button-contained.component';
import {metaReducers, reducers} from '../../../store';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {CerberusService} from '../../../core/services/cerberus.service';

describe('MCDiaComponent', () => {
  let component: MCDiaComponent;
  let fixture: ComponentFixture<MCDiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCDiaComponent, MCButtonContainedComponent, DateDisplayPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatTooltipModule, RouterModule, RouterTestingModule, HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: CerberusService, useClass: ServiceParametersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to diabom when caseObjectType is assign ChangeRequest on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeRequestDIABOM').and.returnValue(of({ID: 'Test_data'}));
    component.caseObjectType = 'ChangeRequest';
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data'});
  });

  it('should set value to diabom when caseObjectType is assign ChangeNotice on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeNoticeDIABOM').and.returnValue(of({ID: 'Test_data_ChangeNotice'}));
    component.caseObjectType = 'ChangeNotice';
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data_ChangeNotice'});
  });

  it('should set value to diabom when caseObjectType is assign ReleasePackage on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeNoticeDIABOM').and.returnValue(of({ID: 'Test_data_ReleasePackage'}));
    component.caseObjectType = 'ReleasePackage';
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data_ReleasePackage'});
  });

  it('should call window.open when triggered openDIABOM & revision is working',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ChangeRequest';
    component.deepLinkChangeRequestDIAURL = 'changeRequestLink';
    const dia = {revision: 'Working'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call window.open when triggered openDIABOM & revision is not working',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ChangeNotice';
    component.deepLinkChangeNoticeDIAURL = 'changeNoticeLink';
    const dia = {revision: 'Completed'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call window.open when triggered openDIABOM & revision is not working and caseObjectType is release package',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ReleasePackage';
    component.deepLinkChangeNoticeDIAURL = 'changeNoticeLink';
    const dia = {revision: 'Completed'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });
});

@Pipe({name: 'dateFormat'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
class ServiceParametersServiceMock {
  getServiceParameter(type: string, category: string, action: string) {
    return [{}] as Value[];
  }

  getChangeNoticeDIABOM(id) {
    return of({ID: 'Test_data_ChangeNotice'});
  }

  getChangeRequestDIABOM(id) {
    return of({ID: 'Test_data'});
  }
}
