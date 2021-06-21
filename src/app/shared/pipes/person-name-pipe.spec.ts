import {PersonNamePipe} from './person-name.pipe';


describe('PersonNamePipe', () => {
  let pipe: PersonNamePipe;

  beforeEach(() => {
    pipe = new PersonNamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('If User is not available,', () => {
    const value = undefined;
    expect(pipe.transform(value)).toEqual('-');
  });

  it('If User has Full name and Abbreviation,', () => {
    const value = {
      abbreviation: 'Q07T',
      departmentName: 'IT US Region US',
      email: 'q07test@example.qas',
      fullName: 'Q 07test',
      userID: 'q07test'
    };
    expect(pipe.transform(value)).toEqual('Q 07test (Q07T)');
  });

  it('If User has Abbreviation but no Full name,', () => {
    const value = {
      abbreviation: 'Q07T',
      departmentName: 'IT US Region US',
      email: 'q07test@example.qas',
      userID: 'q07test'
    };
    expect(pipe.transform(value)).toEqual('Q07T');
  });

  it('If User has UserID but both Full name & Abbreviation not available,', () => {
    const value = {
      departmentName: 'IT US Region US',
      email: 'q07test@example.qas',
      userID: 'q07test'
    };
    expect(pipe.transform(value)).toEqual('q07test');
  });
});
