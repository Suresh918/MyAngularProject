import {CheckItemPipe} from './check-item.pipe';

describe('CheckItemPipe', () => {
  let pipe: CheckItemPipe;

  beforeEach(() => {
    pipe = new CheckItemPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('If value is a Object, return array of object', () => {
    const value = {'Name': 'Abc', 'ID': '123'};
    expect(pipe.transform(value)).toEqual([value]);
  });

  it('If the value is undefined, return empty array', () => {
    const value = undefined;
    expect(pipe.transform(value)).toEqual([]);
  });

  it('If the value is string, return array of string,', () => {
    const value = 'test';
    expect(pipe.transform(value)).toEqual(['test']);
  });

  it('If the value is number, return a number,', () => {
    const value = 123;
    expect(pipe.transform(value)).toEqual(123);
  });
});
