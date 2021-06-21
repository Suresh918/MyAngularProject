import {ChangeUserRoleLabelsPipe} from './change-user-role-labels.pipe';

describe('ChangeUserRoleLabelsPipe', () => {
  let pipe: ChangeUserRoleLabelsPipe;

  beforeEach(() => {
    pipe = new ChangeUserRoleLabelsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('User role to be displayed in proper format,', () => {
    const value = 'ChangeSpecialist1';
    expect(pipe.transform(value)).toEqual('Change Specialist 1');
  });
});
