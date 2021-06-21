import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ProjectMatItemsListCardComponent} from './project-mat-items-list-card.component';


describe('ProjectMatItemsListCardComponent', () => {
  let component: ProjectMatItemsListCardComponent;
  let fixture: ComponentFixture<ProjectMatItemsListCardComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMatItemsListCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMatItemsListCardComponent);
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
