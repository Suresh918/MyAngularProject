import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {StoreModule} from '@ngrx/store';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TitleBarComponent} from './title-bar.component';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ChangeRequestFormConfiguration, GeneralInformationFormConfiguration} from '../../models/mc-configuration.model';
import {metaReducers, reducers} from '../../../store';
import {MatDialogChangeTitleComponent} from '../mat-dialog-change-title/mat-dialog-change-title.component';

describe('TitleBarComponent', function () {
  class HelperServiceMock {
    changeTitle(): Observable<any> {
      return of();
    }
  }

  let fixture: ComponentFixture<TitleBarComponent>;
  let component: TitleBarComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, RouterModule, BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {metaReducers}), MatDialogModule, HttpClientModule],
      declarations: [TitleBarComponent, DateDisplayPipeMock, MatDialogChangeTitleComponent],
      providers: [
        {provide: HelpersService, useClass: HelperServiceMock}
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [MatDialogChangeTitleComponent]} }).compileComponents();
    fixture = TestBed.createComponent(TitleBarComponent);
    component = fixture.componentInstance;
    component.link = {
      'type': 'ChangeRequest',
      'revision': '',
      'ID': '1234'
    };
    component.formGroup = new FormGroup({
      ID: new FormControl(),
      generalInformation: new FormGroup({
        status: new FormControl('statusval'),
        title: new FormControl('statusval')
      })
    });
    component.formConfiguration = {} as ChangeRequestFormConfiguration;
    const statusEnumeration = [
      {value: 'DRAFT', label: 'Draft', sequence: 5},
      {value: 'NEW', label: 'New', sequence: 6},
      {value: 'PLANNED', label: 'Planned', sequence: 7},
      {value: 'IMPLEMENTED', label: 'Implemented', sequence: 8}
    ];
    let generalInformatonFormConfiguration = {} as GeneralInformationFormConfiguration;
    generalInformatonFormConfiguration = {'status': {'options': statusEnumeration}} as GeneralInformationFormConfiguration;
    component.formConfiguration['generalInformation'] = generalInformatonFormConfiguration;
  }));
  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
  /*it('should return a respective case action string', () => {
    expect(component.getCaseAction('Draft')).toBe('DEFINE');
    expect(component.getCaseAction('New')).toBe('SUBMIT');
    expect(component.getCaseAction('Solution defined')).toBe('DEFINE-SOLUTION');
    expect(component.getCaseAction('Impact Analyzed')).toBe('ANALYZE-IMPACT');
    expect(component.getCaseAction('Approved')).toBe('APPROVE');
    expect(component.getCaseAction('Rejected')).toBe('REJECT');
    expect(component.getCaseAction('Closed')).toBe('CLOSE');
    expect(component.getCaseAction('Planned')).toBe('COMMIT');
    expect(component.getCaseAction('Created')).toBe('CREATE');
    expect(component.getCaseAction('Ready for release')).toBe('READY');
    expect(component.getCaseAction('Released')).toBe('RELEASE');
    expect(component.getCaseAction('default')).toBe('');
  });*/
  /*it('navigation based on case should work', () => {
    component.navigateToCase();
    expect(component.navigateToCase()).toBe('/change-requests/1234');
    component.link.type = 'ChangeNotice';
    component.navigateToCase();
    expect(component.navigateToCase()).toBe('/change-notices/1234');
    component.link.type = 'ReleasePackage';
    component.navigateToCase();
    expect(component.navigateToCase()).toBe('/release-packages/1234');
    component.link.type = 'Review';
    component.navigateToCase();
    expect(component.navigateToCase()).toBe('/reviews/1234');
  });*/
  /*it('should call the helpers service function', () => {
    component.formGroup.get('generalInformation.title').setValue('new val');
    component.openChangeTitle();
    expect(component.formGroup.get('generalInformation.title').value).toBe('new val');
  });*/
});

@Pipe({name: 'aalDate'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
