import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

import {UserImagePipe} from './user-profile-img.pipe';
import {ServiceParametersService} from '../../core/services/service-parameters.service';

const serviceParameterServiceMock = {
  getServiceParameter(MCCommon, DEEPLINK, PhotoURL) {
    return [{'name': 'name1'}];
  }
};

describe('UserImagePipe', () => {
  let pipe: UserImagePipe;
  let serviceParameterService: ServiceParametersService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      providers: [{provide: ServiceParametersService, useValue: serviceParameterServiceMock}]
    });
    serviceParameterService = TestBed.get(ServiceParametersService);
    pipe = new UserImagePipe(serviceParameterService as any);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Get user image based on URL', () => {
    const value = 'anikumar';
    pipe.baseUrl = 'https://people.example.com/';
    expect(pipe.transform(value)).toEqual('https://people.example.com/');
  });
});

