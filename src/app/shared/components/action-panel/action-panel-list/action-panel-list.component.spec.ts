import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

import { ActionPanelListComponent } from './action-panel-list.component';
import {UserImagePipe} from '../../../pipes/user-profile-img.pipe';
import {PersonNamePipe} from '../../../pipes/person-name.pipe';
import {ActionPanelIconComponent} from '../action-panel-icon/action-panel-icon.component';
import {provideMockStore} from '@ngrx/store/testing';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';


describe('ActionPanelListComponent', () => {
  let component: ActionPanelListComponent;
  let fixture: ComponentFixture<ActionPanelListComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate').and.returnValue('')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActionPanelListComponent, ActionPanelIconComponent,
        UserImagePipeMock, DateDisplayPipeMock, PersonNamePipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatTooltipModule, RouterTestingModule, MatDialogModule],
      providers: [
        provideMockStore(),
        {provide: UserImagePipe, useClass: UserImagePipeMock},
        {provide: PersonNamePipe, useClass: PersonNamePipeMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: Router, useValue: mockRouter},

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when isEnDateGreater with Data as argument is triggered', () => {
    const date = new Date();
    const returnValue = component.isEnDateGreater(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5));
    expect(returnValue).toBe(true);
  });

  it('should return number of days left', () => {
    const date = new Date();
    const returnValue = component.getEnDateDaysLeft(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5));
    expect(returnValue).toBe(5);
  });

  it('should return status label as per status name from service parameters',  () => {
    const returnValue = component.getActionStatus('approve');
    expect(returnValue).toBe('Approved');
  });

  it('should set navigate when agendaListItemClicked is triggered',  () => {
    const spy = (<jasmine.Spy>mockRouter.navigate).and.returnValue(Promise.resolve());
    const $option = '12345';
    component.openActions($option);
    expect(spy).toHaveBeenCalled();
  });
});
@Pipe({name: 'userImage'})
class UserImagePipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '/image-url';
  }
}
@Pipe({name: 'dateFormat'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
@Pipe({name: 'personName'})
class PersonNamePipeMock implements PipeTransform {
  transform(value) {
    return 'name(abbr)';
  }
}
class ConfigurationServiceMock {
  getFormFieldOptionDataByValue(x, y, z, a?) {
    return 'Approved';
  }
}
