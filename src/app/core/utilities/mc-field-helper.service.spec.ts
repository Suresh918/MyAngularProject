import { TestBed } from '@angular/core/testing';

import { McFieldHelperService } from './mc-field-helper.service';

describe('McFieldHelperService', () => {
  let service: McFieldHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McFieldHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
