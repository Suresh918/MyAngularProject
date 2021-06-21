import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import { MCListItemComponent } from './mc-list-item.component';
import {metaReducers, reducers} from '../../../store';

describe('MCListItemComponent', () => {
  let component: MCListItemComponent;
  let fixture: ComponentFixture<MCListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCListItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALListItemModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit actionpress when onActionSubmit is triggered', () => {
    spyOn(component.actionPress, 'emit');
    const event = {};
    component.onActionSubmit(event);
    expect(component.actionPress.emit).toHaveBeenCalled();
  });
});
