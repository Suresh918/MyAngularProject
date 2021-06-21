import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CreatorMatItemsListCardComponent} from './creator-mat-items-list-card.component';


describe('CreatorMatItemsListCardComponent', () => {
  let component: CreatorMatItemsListCardComponent;
  let fixture: ComponentFixture<CreatorMatItemsListCardComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorMatItemsListCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorMatItemsListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onSelectItem, when onSelectMenuItem is triggered', () => {
    spyOn(component.onSelectItem, 'emit');
    component.onSelectMenuItem({});
    expect(component.onSelectItem.emit).toHaveBeenCalledWith({});
  });
});
