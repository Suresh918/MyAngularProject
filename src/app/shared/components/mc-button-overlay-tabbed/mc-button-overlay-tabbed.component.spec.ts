import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {Pipe, PipeTransform} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HttpClientModule} from '@angular/common/http';
import {MCButtonOverlayTabbedComponent} from './mc-button-overlay-tabbed.component';
import {PersonNamePipe} from '../../pipes/person-name.pipe';
import {HelpersService} from '../../../core/utilities/helpers.service';

describe('MCButtonOverlayTabbedComponent', () => {
  let component: MCButtonOverlayTabbedComponent;
  let fixture: ComponentFixture<MCButtonOverlayTabbedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonOverlayTabbedComponent, DurationPipeMock, PersonNamePipeMock],
      imports: [AALButtonOverlayTabbedModule, AALCardSummaryModule, MatIconModule, MatTooltipModule, HttpClientModule],
      providers: [
        {provide: AALDurationPipe, useClass: DurationPipeMock},
        {provide: PersonNamePipe, useClass: PersonNamePipeMock},
        {provide: HelpersService, useClass: HelpersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonOverlayTabbedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set, yPosition on trigger of ngAfterViewInit', () => {
    component.buttonPositionDiv = {
      nativeElement:  {
        offsetTop: '0'
      }
    };
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.yPosition).toEqual('above');
  });

  it('should emit, panelOpened on trigger of onOverlayTabbedPanelOpen', () => {
    spyOn(component.panelOpened, 'emit');
    const $event = {test: 'test'};
    component.onOverlayTabbedPanelOpen($event);
    expect(component.panelOpened.emit).toHaveBeenCalled();
  });

  it('should emit, selectedTab on trigger of selectedTabClick', () => {
    spyOn(component.selectedTab, 'emit');
    const $event = {test: 'test'};
    component.selectedTabClick($event);
    expect(component.selectedTab.emit).toHaveBeenCalled();
  });

  it('should emit, showAllItems on trigger of showAllItemsClick', () => {
    spyOn(component.showAllItems, 'emit');
    component.showAllItemsClick();
    expect(component.showAllItems.emit).toHaveBeenCalled();
  });

  it('should emit, listItemClicked on trigger of onOverLayTabbedListItemClick', () => {
    spyOn(component.listItemClicked, 'emit');
    const $event = {test: 'test'};
    component.onOverLayTabbedListItemClick($event);
    expect(component.listItemClicked.emit).toHaveBeenCalled();
  });
});

class HelpersServiceMock {
  getCardVerticalPosition(offsetTop) {
    return 'above';
  }
}

@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}

@Pipe({name: 'personName'})
class PersonNamePipeMock implements PipeTransform {
  transform(value) {
    return 'name(abbr)';
  }
}

