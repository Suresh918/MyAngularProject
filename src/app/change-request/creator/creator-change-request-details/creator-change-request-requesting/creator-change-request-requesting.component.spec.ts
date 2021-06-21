import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreatorChangeRequestRequestingComponent} from './creator-change-request-requesting.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';

import {HelpersService} from '../../../../core/utilities/helpers.service';
import {ChangeRequestService} from '../../../change-request.service';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';
import {ImpactedItemService} from '../../../../core/services/impacted-item.service';
import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';


describe('CreatorChangeRequestRequestingComponent', () => {
  let component: CreatorChangeRequestRequestingComponent;
  let fixture: ComponentFixture<CreatorChangeRequestRequestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatorChangeRequestRequestingComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: ImpactedItemService, useClass: ImpactedItemServiceMock},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChangeRequestRequestingComponent);
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
  it('should set problemItemsData, when getLinkedProblemItems is triggered', () => {
    component.getLinkedProblemItems('1');
    expect(component.problemItemsData.length).toEqual(1);
  });
  it('should set selectedProblemItem, when updateChangeOwnerField is triggered', () => {
    component.updateChangeOwnerField({creators: ['Test User'], name: 'PR-00000012'});
    expect(component.selectedProblemItem).toEqual('PR-00000012');
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

class ChangeRequestServiceMock {

}

class ConfigurationServiceMock {
  getFormFieldParameters(caseObject) {
    return {
      air: {},
      pbs: {}
    };
  }
}

class ImpactedItemServiceMock {
  getImpactedItems(id) {
    return of([{id: 1}]);
  }
}

class HelpersServiceMock {

}
