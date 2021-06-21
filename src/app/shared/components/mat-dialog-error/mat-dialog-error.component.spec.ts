import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {MemoizedSelector, StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {MatDialogErrorComponent} from './mat-dialog-error.component';
import {metaReducers, reducers} from '../../../store';
import {ErrorResponseModel, ErrorState} from '../../models/mc-store.model';
import {selectServiceError} from '../../store';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";


describe('MatDialogErrorComponent', function () {
  let fixture: ComponentFixture<MatDialogErrorComponent>;
  let component: MatDialogErrorComponent;
  let mockStore: MockStore;
  let mockCaseObjectSelector1: MemoizedSelector<ErrorState, {}>;

  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, BrowserModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      declarations: [MatDialogErrorComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        provideMockStore()
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogErrorComponent);
    mockStore = TestBed.inject(MockStore);
    mockCaseObjectSelector1 = mockStore.overrideSelector(
      selectServiceError,
        [{transactionID: '123456',
        statusCode: 1,
        errorMessage: '',
        linkUrl: '',
        disableOverlay: false}] as ErrorResponseModel
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('close function call should work', () => {
    const dialogCloseSpy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
});

class ConfigurationServiceMock {
  getLinkUrl(type) {
    return 'url';
  }
}
