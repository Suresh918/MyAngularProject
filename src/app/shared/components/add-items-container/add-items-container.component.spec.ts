import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddItemsContainerComponent } from './add-items-container.component';
import {Link} from '../../../shared/models/mc-presentation.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HelpersService} from '../../../core/utilities/helpers.service';

describe('AddItemsContainerComponent', () => {
  let component: AddItemsContainerComponent;
  let fixture: ComponentFixture<AddItemsContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemsContainerComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: HelpersService, useClass: HelpersServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemsContainerComponent);
    component = fixture.componentInstance;
    component.itemList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addItem', () => {
    spyOn(component.addItemEvent, 'emit');
    const $event = {value: 'sample data test'};
    component.addItem($event);
    expect(component.addItemEvent.emit).toHaveBeenCalled();
  });

  it('should call removeItem', () => {
    spyOn(component.removeItemEvent, 'emit');
    const $event = {value: 'sample data test'};
    component.removeItem($event);
    expect(component.removeItemEvent.emit).toHaveBeenCalled();
  });

  it('should call sortClicked', () => {
    spyOn(component.sortChangeEvent, 'emit');
    component.sortClicked();
    expect(component.sortChangeEvent.emit).toHaveBeenCalled();
  });

  it('should call onScroll', () => {
    spyOn(component.listScrolled, 'emit');
    component.onScroll();
    expect(component.listScrolled.emit).toHaveBeenCalled();
  });

  it('should call navigateToCaseObject', () => {
    spyOn(window, 'open').and.callThrough();
    const item = { 'type': 'ChangeRequest'} as Link;
    component.navigateToCaseObject(item);
    expect(window.open).toHaveBeenCalled();
  });


});

class HelpersServiceMock {
  getCaseObjectForms(type: string) {
    return {};
  }
}
