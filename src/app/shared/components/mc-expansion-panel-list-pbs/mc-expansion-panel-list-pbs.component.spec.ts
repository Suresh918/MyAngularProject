import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
import {of, Subscription, throwError} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {McExpansionPanelListPbsComponent} from './mc-expansion-panel-list-pbs.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {Value} from '../../models/service-parameters.model';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ProductBreakdownStructure} from '../../models/product-breakdown-structure.model';

describe('McExpansionPanelListPbsComponent', () => {
  let component: McExpansionPanelListPbsComponent;
  let fixture: ComponentFixture<McExpansionPanelListPbsComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of([
      { ID: '0assessment',
        answer: 'YES',
        answerDetail: 'sada',
        detailID: '0assessmentDetail',
        question: 'Is this a change that introduces a new 11 NC of an existing Equipment Component (i.e. a cabinet or an exposure unit)?'}],
    ), close: null });

  const dialogMock = {
    open: () => { },
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McExpansionPanelListPbsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALExpansionPanelListModule, HttpClientModule, BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: AgendaItemService, useClass: ServiceParametersServiceMock},
        {provide: ChangeRequestService, useClass: ServiceParametersServiceMock},
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelListPbsComponent);
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPBSListOnCRID on initialization when changeRequestID is set',  () => {
    spyOn(component, 'getPBSListOnCRID');
    component.changeRequestID = '123456';
    component.ngOnInit();
    expect(component.getPBSListOnCRID).toHaveBeenCalled();
  });

  it('when agendaItemId is should call getPBSListForLinkedObjectOfAI', () => {
    spyOn(component, 'getPBSListForLinkedObjectOfAI');
    component.agendaItemId = '123456';
    expect(component.getPBSListForLinkedObjectOfAI).toHaveBeenCalled();
  });

  it('should call handlePBSList when success response return from service handlePBSList',  () => {
    spyOn(component, 'handlePBSList');
    component.getPBSListForLinkedObjectOfAI();
    expect(component.handlePBSList).toHaveBeenCalled();
  });

  it('should call handleError when error response return from service handlePBSList',  () => {
    const xService = fixture.debugElement.injector.get(AgendaItemService);
    spyOn(xService, 'getPBSItems').and.returnValue(throwError(new Error('error')));
    spyOn(component, 'handleError');
    component.getPBSListForLinkedObjectOfAI();
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should call createItemList when changeRequestFormGroup have PBSIDs ',  () => {
    spyOn(component, 'createItemList');
    component.ngOnChanges({changeRequestFormGroup: new SimpleChange(null, {value: {PBSIDs: ['12345', '12346', '12347']}}, false)});
    expect(component.createItemList).toHaveBeenCalled();
  });

  it('should call onAddPBSItem when change event fire with openDialog', () => {
    spyOn(component, 'onAddPBSItem');
    component.ngOnChanges({openDialog: new SimpleChange(null, {value: {PBSIDs: ['12345', '12346', '12347']}}, false)});
    expect(component.onAddPBSItem).toHaveBeenCalled();
  });

  it('should expansionPanelItemConfigurationList length be greater then zero when createItemList is called with a non zero number of items in itemsList', () => {
    component.itemsList = [{ id: 'string',
      projectID: 'string',
      productID: 'string',
      deliverable: 'string',
      functionalClusterID: 'string',
      functionalClusterParentID: 'string',
      owner: {},
      status: 'string',
      pgpIP: 'string',
      changeRequestID: 'string',
      selected: false,
      type: [],
      errorInServiceCall: 'string',
      itemType: 'string'
    }];
    component.pbsDeleteButtonSubscriptions.push(new Subscription());
    component.deleteButtonAction$ = of(true);
    component.createItemList();
    expect(component.expansionPanelItemConfigurationList.length).toBeGreaterThan(0);
  });

  /*it('should call handlePBSList when service call return success getPBSListOnCRID',  () => {
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getPBSListOnCRID').and.returnValue(of([
      {
        ID: 'string',
        projectID: 'string',
        productID: 'string',
        deliverable: 'string',
        functionalClusterID: 'string',
      } as ProductBreakdownStructure]));
    spyOn(component, 'handlePBSList');
    component.getPBSListOnCRID('123456');
    expect(component.handlePBSList).toHaveBeenCalled();
  });*/

  it('should call handleError method when service call trigger and return error response', () => {
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getPBSListOnCRID').and.returnValue(throwError(new Error('error')));
    spyOn(component, 'handleError');
    component.getPBSListOnCRID('123456');
    expect(component.handleError).toHaveBeenCalled();
  });

  /*it('should set itemList when PBS list have values', () => {
    const list = [{
      ID: 'test',
      projectID: 'string',
      productID: 'string',
      deliverable: 'string',
      functionalClusterID: 'string',
    } as ProductBreakdownStructure];
    component.handlePBSList(list);
    expect(component.itemsList.length).toBeGreaterThan(0);
  });*/

  it('should have open the window when already open dialog is been closed',  () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openDialog = true;
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('test')
    });
    spyOn(window, 'open');
    component.onAddPBSItem('pbs');
    expect(window.open).toHaveBeenCalled();
  });

  it('should call getPBSListOnCRID when onAddPBSItem is triggered',  () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openDialog = false;
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('test')
    });
    spyOn(component, 'getPBSListOnCRID');
    component.changeRequestID = '12345';
    component.onAddPBSItem('pbs');
    expect(component.getPBSListOnCRID).toHaveBeenCalled();
  });
});


class ServiceParametersServiceMock {
  getServiceParameter(type: string, category: string, action: string) {
    return [{}] as Value[];
  }

  getPBSItems(id) {
    return of([{  ID: 'string',
      projectID: 'string',
      productID: 'string',
      deliverable: 'string',
      functionalClusterID: 'string',
      functionalClusterParentID: 'string',
      owner: 'string',
      status: 'string',
      pgpIP: 'string',
      changeRequestID: 'string',
      selected: false}] );
  }

  getPBSListOnCRID(id) {
    return of({test: 'test'});
  }
  unlinkProductBreakdownStructure$(id, value) {
    return of({test: 'test'});
  }
}
