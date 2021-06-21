import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {SimpleChange} from '@angular/core';
import {of, throwError} from 'rxjs';


import { MCAutoCompleteProductMultipleComponent } from './mc-auto-complete-product-multiple.component';
import {metaReducers, reducers} from '../../../store';
import {ProjectService} from '../../../core/services/project.service';
import {HelpersService} from '../../../core/utilities/helpers.service';

describe('MCAutoCompleteProductMultipleComponent', () => {
  let component: MCAutoCompleteProductMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteProductMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProductMultipleComponent ],
      imports: [AALAutoCompleteMultipleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: ProjectService, useClass: ProjectServiceMock},
        {provide: HelpersService, useClass: ProjectServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteProductMultipleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should be length greater then zero when service call `getProjects` return value', () => {
    const simpleChange = {control: new SimpleChange(null, {value:  [{projectDefinition: 'NXE3350B-0302', description: '1061000302'},
          {projectDefinition: 'NXE3350B-0302', description: '1061000302'}]}, false)};
    component.ngOnChanges(simpleChange);
    expect(component.control.value.length).toBeGreaterThan(0);
  });*/

  /*it('Should set value to control when projectDefinition length is greater then zero ', () => {
    const simpleChange = {control: new SimpleChange(null, {value:  [{projectDefinition: 'NXE3350B-0302', description: '1061000302'},
          {projectDefinition: 'NXE3350B-0302', description: '1061000302'}]}, false)};
    const xService = fixture.debugElement.injector.get(ProjectService);
    spyOn(xService, 'getProjects$').and.returnValue(throwError(new Error('test')));
    component.ngOnChanges(simpleChange);
    expect(component.control.value.projectDefinition.length).toBeGreaterThan(0);
  });*/

  it('should call saveFieldChanges when fieldSaveNotApplicable is not set onAcceptChange',  () => {
    spyOn(component, 'saveFieldChanges');
    const $event: AcceptedChange = { ID: 'elementID', oldValue: 'old value', value: 'newValue' };
    component.onAcceptChange($event);
    expect(component.saveFieldChanges).toHaveBeenCalled();
  });
});
class ProjectServiceMock {
  getProjects$(response) {
    return of([{test: 'test'}]);
  }

  getErrorMessage(err) {
    return 'test error message';
  }
}
