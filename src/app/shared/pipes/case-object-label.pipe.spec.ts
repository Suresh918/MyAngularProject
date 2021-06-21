import {ConfigurationService} from '../../core/services/configurations/configuration.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {CaseObjectLabelPipe} from './case-object-label.pipe';
import {HelpersService} from '../../core/utilities/helpers.service';

const serviceParameterServiceMock = {
  getCaseObjectMetaData(caseObject, FORMFIELDCONFIGURATION) {
    return {
      generalInformation: {
        status: {
          enumeration: [{name: 'DRAFT', label: 'Draft', sequence: 1},
            {name: 'OBSOLETED', label: 'Obsoleted', sequence: 100},
            {name: 'NEW', label: 'New', sequence: 2}]
        },
        state: {
          enumeration: [{name: 'CREATE', label: 'Create', sequence: 1},
            {name: 'DEFINE-SOLUTION', label: 'Define Solution', sequence: 2}]
        }
      }
    };
  },
  getCaseObjectForms(caseObject) {
    return {
      generalInformation: {
        status: {
          enumeration: [{name: 'DRAFT', label: 'Draft', sequence: 1},
            {name: 'OBSOLETED', label: 'Obsoleted', sequence: 100},
            {name: 'NEW', label: 'New', sequence: 2}]
        },
        state: {
          enumeration: [{name: 'CREATE', label: 'Create', sequence: 1},
            {name: 'DEFINE-SOLUTION', label: 'Define Solution', sequence: 2}]
        }
      }
    };
  }
};

describe('CaseObjectLabelPipe', () => {
  let pipe: CaseObjectLabelPipe;
  let configurationService: ConfigurationService;
  let helperService: HelpersService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      providers: [{provide: ConfigurationService, useValue: serviceParameterServiceMock},
        {provide: HelpersService, useValue: serviceParameterServiceMock}]
    });
    configurationService = TestBed.inject(ConfigurationService);
    helperService = TestBed.inject(HelpersService);
    pipe = new CaseObjectLabelPipe(helperService, configurationService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Get case object label based on input value and caseObject', () => {
    const value = 'CREATE';
    const caseObject = 'ChangeRequest';
    pipe.caseObjectFormConfiguration = {
      generalInformation: {
        status: {
          enumeration: [{name: 'DRAFT', label: 'Draft', sequence: 1},
            {name: 'OBSOLETED', label: 'Obsoleted', sequence: 100},
            {name: 'NEW', label: 'New', sequence: 2}]
        },
        state: {
          enumeration: [{name: 'CREATE', label: 'Create', sequence: 1},
            {name: 'DEFINE-SOLUTION', label: 'Define Solution', sequence: 2}]
        }
      }
    };
    expect(pipe.transform(value, caseObject)).toEqual('Create');
  });

  it('Empty string when caseObjectFormConfiguration is not set', () => {
    const value = '';
    const caseObject = 'ChangeRequest';
    pipe.caseObjectFormConfiguration = {};
    expect(pipe.transform(value, caseObject)).toEqual('');
  });
});

