/*
import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

import {UserRoleTransformPipe} from './user-role-trasform.pipe';
import {ServiceParametersService} from '../../core/services/service-parameters.service';
import {PreferredRoleFormConfiguration} from '../models/mc-presentation.model';

const serviceParameterServiceMock = {
  getCaseObjectMetaData(MCCommon, PREFERREDROLE) {
    return {} as PreferredRoleFormConfiguration;
  }
};

describe('UserRoleTransformPipe', () => {
  let pipe: UserRoleTransformPipe;
  let serviceParameterService: ServiceParametersService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      providers: [{provide: ServiceParametersService, useValue: serviceParameterServiceMock}]
    });
    serviceParameterService = TestBed.get(ServiceParametersService);
    pipe = new UserRoleTransformPipe(serviceParameterService as any);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Get user-role based on input value', () => {
    const roles = ['changeSpecialist1'];
    pipe.preferredRoleList = {
      changeSpecialist1: {
        ID: 'changeSpecialist1',
        abbreviation: 'CS1',
        // tslint:disable-next-line:max-line-length
        explanation: 'The Change Specialist 1 manages the processing of Change Requests from their initiation to their final disposition. In the initiation phase the Change Specialist 1 is triggered to create a new Change Request by, for example, AIR issues, PBS items or ‘Customer Special Requests’. The Change Specialist 1 verifies a Development & Engineering Project Lead is appointed and that the required information is in place to start solution definition and impact analysis for the change. This results in impacted products/affected items, a concept design being made, costs and benefits, an implementation strategy and other required information for the change. A business case for the change is prepared by the Development & Engineering Project Lead (supported by a Change Specialist 2) and is consolidated by the Change Specialist 1. The Change Specialist 1 places the Change requests with a prepared business case on the agenda of the Change Board of the relevant business line(s), makes sure the Change Board members are prepared and aligned with the Cross Sector team, and chairs the Change Board meeting. For each Change Request a decision must be made supported by all Change Board members. The Change Specialist 1 role includes responsibility for minimizing the time between receipt of a request and its eventual approval or rejection. Finally, the Change Specialist 1 monitors progress of the Change request during the Change Notification phase in consultation with Change Specialist 2.',
        label: 'Change Specialist 1',
        placeholder: 'Enter Text'
      }
      } as any;
    expect(pipe.transform(roles)).toEqual('Change Specialist 1');
  });

  it('Empty string when no roles are available', () => {
    const roles = '';
    pipe.preferredRoleList = {
      changeSpecialist1: {
        ID: 'changeSpecialist1',
        abbreviation: 'CS1',
        explanation: 'The Change Specialist 1 manages the processing of Change Requests from their initiation to their final disposition. In the initiation phase the Change Specialist 1 is triggered to create a new Change Request by, for example, AIR issues, PBS items or ‘Customer Special Requests’. The Change Specialist 1 verifies a Development & Engineering Project Lead is appointed and that the required information is in place to start solution definition and impact analysis for the change. This results in impacted products/affected items, a concept design being made, costs and benefits, an implementation strategy and other required information for the change. A business case for the change is prepared by the Development & Engineering Project Lead (supported by a Change Specialist 2) and is consolidated by the Change Specialist 1. The Change Specialist 1 places the Change requests with a prepared business case on the agenda of the Change Board of the relevant business line(s), makes sure the Change Board members are prepared and aligned with the Cross Sector team, and chairs the Change Board meeting. For each Change Request a decision must be made supported by all Change Board members. The Change Specialist 1 role includes responsibility for minimizing the time between receipt of a request and its eventual approval or rejection. Finally, the Change Specialist 1 monitors progress of the Change request during the Change Notification phase in consultation with Change Specialist 2.',
        label: 'Change Specialist 1',
        placeholder: 'Enter Text'
      }
    } as any;
    expect(pipe.transform(roles)).toEqual('');
  });
});
*/
