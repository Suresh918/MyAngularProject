import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {ContextIdTransformPipe} from './context-id-transform.pipe';

describe('ContextIdTransformPipe', () => {
  let pipe: ContextIdTransformPipe;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
    });
    pipe = new ContextIdTransformPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Get Priority based on input value', () => {
    const value = 'MDG-CR-0000000124';
    expect(pipe.transform(value)).toEqual('MDG-CR-124');
  });

  it('Empty string when no priority is set', () => {
    const value = 'ECN-1245';
    expect(pipe.transform(value)).toEqual('ECN-1245');
  });
});

