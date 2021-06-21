import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {ProjectChangeRequestRequestingComponent} from './project-change-request-requesting.component';


describe('ProjectChangeRequestRequestingComponent', () => {
  let component: ProjectChangeRequestRequestingComponent;
  let fixture: ComponentFixture<ProjectChangeRequestRequestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectChangeRequestRequestingComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestRequestingComponent);
    component = fixture.componentInstance;
    component.changeRequestConfiguration = {} as ChangeRequestFormConfiguration;
    component.changeRequestConfiguration['air'] = {
      help: {
        help: {
          message: 'test'
        }
      }
    };
    component.changeRequestConfiguration['pbs'] = {
      help: {
        help: {
          message: 'test'
        }
      }
    };
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(1234),
      change_owner: new FormControl(null)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit updateChangeRequestView, when updateCRTemplate is triggered', () => {
    spyOn(component.updateChangeRequestView, 'emit');
    component.updateCRTemplate({id: 1});
    expect(component.updateChangeRequestView.emit).toHaveBeenCalledWith({id: 1});
  });
  it('should set change_owner control value in formgroup, when setChangeOwner is triggered', () => {
    component.setChangeOwner({change_owner: 'TestUser'});
    expect(component.changeRequestFormGroup.get('change_owner').value).toEqual('TestUser');
  });
  it('should emit setPriorityStatus, when setPriorityInTitle is triggered', () => {
    spyOn(component.setPriorityStatus, 'emit');
    component.setPriorityInTitle({id: 1, analysis_priority: '1 - Critical'});
    expect(component.setPriorityStatus.emit).toHaveBeenCalledWith('1 - Critical');
  });
  it('should emit setPriorityStatus, when getCrDetailsOnLinkingPbs is triggered', () => {
    spyOn(component.getCrDetails, 'emit');
    component.getCrDetailsOnLinkingPbs();
    expect(component.getCrDetails.emit).toHaveBeenCalled();
  });
  it('should set wiComments, when wiCommentsData value is set', () => {
    component.wiCommentsData = [{}];
    const data = component.wiCommentsData;
    expect(component.wiComments.length).toEqual(1);
  });
});
