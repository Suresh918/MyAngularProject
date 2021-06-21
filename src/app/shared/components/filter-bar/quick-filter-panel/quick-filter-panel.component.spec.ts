import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {of} from 'rxjs';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import { QuickFilterPanelComponent } from './quick-filter-panel.component';
import {metaReducers, reducers} from '../../../../store';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';

describe('QuickFilterPanelComponent', () => {
  let component: QuickFilterPanelComponent;
  let fixture: ComponentFixture<QuickFilterPanelComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({caseObject: 'changeRequest', filterName: 'testFilterName'},
    ), close: null });

  const dialogMock = {
    open: () => { },
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickFilterPanelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatTooltipModule, HttpClientModule, MatSnackBarModule,
        FormsModule, ReactiveFormsModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        MockStore,
        provideMockStore()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickFilterPanelComponent);
    component = fixture.componentInstance;
    component.caseObjectFilters = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isDuplicateFilterName false when resetFilterValues is triggered', () => {
    component.caseObject = 'changeRequest';
    component.resetFilterValues();
    expect(component.isDuplicateFilterName).toBe(false);
  });

  it('should emit quickFilterAdded when addFilter is triggered', () => {
    spyOn(component.quickFilterAdded, 'emit');
    component.addFilter('changeRequest', true);
    expect(component.quickFilterAdded.emit).toHaveBeenCalled();
  });

  it('should emit quickFilterRemoved when removeFilter is triggered',  () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(component.quickFilterRemoved, 'emit');
    const events = {stopPropagation: function() {}};
    component.removeFilter(events, 'changeRequest');
    expect(component.quickFilterRemoved.emit).toHaveBeenCalledWith('changeRequest');
  });

  it('should emit quickFilterMenu close when customOptionSelected is triggered',  () => {
    spyOn(component.quickFilterMenu.close, 'emit');
    component.customOptionSelected('changeRequest');
    expect(component.quickFilterMenu.close.emit).toHaveBeenCalled();
  });

  it('should quickFilterSelected  emit when quickOptionSelected is triggered',  () => {
    spyOn(component.quickFilterSelected, 'emit');
    component.quickOptionSelected('developer', 'Type Of role');
    expect(component.quickFilterSelected.emit).toHaveBeenCalled();
  });

  it('should emit quickFilterSelected when secondaryFilterOption is triggered parameter name and status',  () => {
    spyOn(component.quickFilterSelected, 'emit');
    component.secondaryFilterOption('dueDate', 'closed');
    component.secondaryFilterOption('agenda', 'closed');
    component.secondaryFilterOption('decisionLog', 'closed');
    component.secondaryFilterOption('review', 'closed');
    component.secondaryFilterOption('upcomingMeetingsWidget', 'closed');
    expect(component.quickFilterSelected.emit).toHaveBeenCalled();
  });

  it('should open matSnackBar when copyToClipBoard is triggered', () => {
    spyOn(component.matSnackBar, 'open');
    document.dispatchEvent(new Event('ClipboardEvent')); // not working
    component.copyToClipBoard('changeRequest');
    expect(component.matSnackBar.open).toHaveBeenCalled();
  });

  it('should emit quickFilterImported when dialog is closed', () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(component.quickFilterImported, 'emit');
    const events = {stopPropagation: function() {}};
    component.openImportFilterDialog(events);
    expect(component.quickFilterImported.emit).toHaveBeenCalled();
  });

  it('should return true when validateFilterName is triggered',  () => {
    component.filterNameElement = {nativeElement : {
        focus: () => {
        }
      }};
    component.setFocus();
    const returnValue = component.validateFilterName('testingString');
    expect(returnValue).toBe(false);
  });

});
class UserProfileServiceMock {
  getUserProfile() {
    return {user: {userID: 'testUserId', memberships: [{category : 'ChangeControlBoards', groups: [{name : 'test1'}, {name : 'test2'}]}]}};
  }
}
class HelpersServiceMock {
  generateFilterQuery(firstName, caseObjectFilters, caseObject) {
    return 'testFilterQuery';
  }
}
