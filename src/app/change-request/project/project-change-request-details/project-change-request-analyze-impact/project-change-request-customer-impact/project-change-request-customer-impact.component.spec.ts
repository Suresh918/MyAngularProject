import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';

import {ProjectChangeRequestCustomerImpactComponent} from './project-change-request-customer-impact.component';

describe('ProjectChangeRequestCustomerImpactComponent', () => {
  let component: ProjectChangeRequestCustomerImpactComponent;
  let fixture: ComponentFixture<ProjectChangeRequestCustomerImpactComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectChangeRequestCustomerImpactComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestCustomerImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit changeRequestDataChanged event when changeRequestChanged is clicked', () => {
    const event = new MouseEvent('click');
    spyOn(component.changeRequestDataChanged, 'emit');
    component.changeRequestChanged(event);
    expect(component.changeRequestDataChanged.emit).toHaveBeenCalledWith(event);
  });
});

class UserProfileServiceMock {
  getState() {
    return {
      myTeamManagementState: {
        commonCaseObjectState: {
          filters: {
            filtersModel: {
              currentDefaultFilter: {
                people: {}
              }
            }
          }
        }
      }
    };
  }

  updateUserProfileStates(state) {
    return {};
  }

  updateCaseObjectSortInState(sort, filterObject, isOverviewType) {
    return {};
  }

  getStatesData() {
    return {
      changeRequestState: {
        imsPageState: {
          fontSize: '12px',
          viewState: 'active'
        },
      },
    };
  }
}
