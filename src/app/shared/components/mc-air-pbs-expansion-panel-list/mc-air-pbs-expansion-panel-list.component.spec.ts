import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {HelpersService} from '../../../core/utilities/helpers.service';
import {MCAirPbsExpansionPanelListComponent} from './mc-air-pbs-expansion-panel-list.component';
import {metaReducers, reducers} from '../../../store';

describe('MCAirPbsExpansionPanelListComponent', () => {
  let component: MCAirPbsExpansionPanelListComponent;
  let fixture: ComponentFixture<MCAirPbsExpansionPanelListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAirPbsExpansionPanelListComponent ],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        {provide: HelpersService, useClass: HelpersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAirPbsExpansionPanelListComponent);
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('test')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    component.unsubscribeDeleteActions([new Subscription(), new Subscription(), new Subscription()]);
    expect(component).toBeTruthy();
  });

  it('should open new window on trigger onItemClick', () => {
    spyOn(window, 'open');
    component.deepLinkUrl = 'http://www.google.com/';
    const id = '123';
    component.onItemClick(id);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call addButtonActions on initialization',  () => {
    spyOn(component, 'addButtonActions');
    component.changeRequestID = '12345';
    component.changeRequestFormGroup.get('ID').setValue({ID: 123456});
    component.ngOnInit();
    expect(component.addButtonActions).toHaveBeenCalled();
  });

  it('should set value to panelError  when handleError trigger',  () => {
    const err = 'test error';
    component.handleError(err);
    expect(component.panelError.message).toBe('test error');
  });

  it('should execute addButtonActions', () => {
    component.addButtonActions('123456');
    expect(component.deleteButtonAction$).toBeTruthy();
  });
});
class HelpersServiceMock {
  getErrorMessage(err) {
    return 'test error';
  }
}
