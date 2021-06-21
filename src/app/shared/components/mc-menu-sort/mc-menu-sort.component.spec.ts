import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MCMenuSortComponent } from './mc-menu-sort.component';
import {metaReducers, reducers} from '../../../store';

describe('MCMenuSortComponent', () => {
  let component: MCMenuSortComponent;
  let fixture: ComponentFixture<MCMenuSortComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCMenuSortComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALMenuSortModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCMenuSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sortChange when triggerOverviewListSortChange is triggered', () => {
    spyOn(component.sortChange, 'emit');
    const event = {};
    component.triggerOverviewListSortChange(event);
    expect(component.sortChange.emit).toHaveBeenCalled();
  });
});
