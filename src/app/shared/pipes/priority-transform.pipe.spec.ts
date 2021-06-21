import {PriorityTransformPipe} from './priority-transform.pipe';
import {ServiceParametersService} from '../../core/services/service-parameters.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {ChangeRequestFormConfiguration} from '../models/mc-configuration.model';

const serviceParameterServiceMock = {
  getCaseObjectMetaData(ChangeRequest, FORMFIELDCONFIGURATION) {
    return {} as ChangeRequestFormConfiguration;
  }
};

describe('PriorityTransformPipe', () => {
  let pipe: PriorityTransformPipe;
  let serviceParameterService: ServiceParametersService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      providers: [{provide: ServiceParametersService, useValue: serviceParameterServiceMock}]
    });
    serviceParameterService = TestBed.inject(ServiceParametersService);
    pipe = new PriorityTransformPipe(serviceParameterService as any);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Get Priority based on input value', () => {
    const value = 1;
    pipe.changeRequestConfiguration = {
      implementationPriority: {
        enumeration:
          [{name: '1', label: '1 - Critical', sequence: 1},
            {name: '2', label: '2 - High', sequence: 2},
            {name: '3', label: '3 - Medium', sequence: 3},
            {name: '4', label: '4 - Low', sequence: 4}]
      },
    } as any;
    expect(pipe.transform(value)).toEqual('1 - Critical');
  });

  it('Empty string when no priority is set', () => {
    const value = '';
    pipe.changeRequestConfiguration = {
      implementationPriority: {
        enumeration:
          [{name: '1', label: '1 - Critical', sequence: 1},
            {name: '2', label: '2 - High', sequence: 2},
            {name: '3', label: '3 - Medium', sequence: 3},
            {name: '4', label: '4 - Low', sequence: 4}]
      },
    } as any;
    expect(pipe.transform(value)).toEqual('');
  });
});

