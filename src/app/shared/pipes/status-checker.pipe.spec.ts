import {StatusCheckerPipe} from './status-checker.pipe';

describe('StatusCheckerPipe', () => {
  let pipe: StatusCheckerPipe;

  beforeEach(() => {
    pipe = new StatusCheckerPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('If value is a Object, return array of object', () => {
    const value = '';
    const selectedTabIndex = 1;
    const tabIndex = 1;
    expect(pipe.transform(value, selectedTabIndex, tabIndex)).toEqual('remove');
  });

  it('If the value is undefined, return empty array', () => {
    const value = '';
    const selectedTabIndex = 2;
    const tabIndex = 1;
    expect(pipe.transform(value, selectedTabIndex, tabIndex)).toEqual('check');
  });

  it('If the value is string, return array of string,', () => {
    const value = '';
    const selectedTabIndex = 2;
    const tabIndex = 3;
    expect(pipe.transform(value, selectedTabIndex, tabIndex)).toEqual('');
  });
});
