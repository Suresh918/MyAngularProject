import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AirPbsItemsContainerComponent} from './air-pbs-items-container.component';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {of} from 'rxjs';



describe('AirPbsItemsContainerComponent', () => {
  let component: AirPbsItemsContainerComponent;
  let fixture: ComponentFixture<AirPbsItemsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirPbsItemsContainerComponent ],
      providers: [{provide: ConfigurationService, useClass: ConfigurationServiceMock}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirPbsItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addIssueEvent when item is added', () => {
    spyOn(component.addIssueEvent, 'emit');
    const airPbsItems = [{id: 1}, {id: 2}];
    component.addIssue(airPbsItems);
    expect(component.addIssueEvent.emit).toHaveBeenCalled();
  });

  it('should emit removeIssueEvent when item is deleted', () => {
    spyOn(component.removeIssueEvent, 'emit');
    const airPbsItems = [{id: 1}, {id: 2}];
    component.deleteIssue(airPbsItems);
    expect(component.removeIssueEvent.emit).toHaveBeenCalled();
  });

  it('should set dragElementIndex when drag has started', () => {
    component.trigger = 'air';
    const returnValue = component.getHeader();
    expect(returnValue).toBe('AIR Issues');
  });

  it('should set header based on trigger type', () => {
    component.trigger = 'pbs';
    const returnValue = component.getHeader();
    expect(returnValue).toBe('PBS Issues');
  });

  it('should set header based on trigger type', () => {
    component.trigger = '';
    const returnValue = component.getHeader();
    expect(returnValue).toBe('AIR/PBS Issues');
  });

  it('should trigger deeplink url for AIR, when itemType is AIR & navigation issue called', () => {
    spyOn(window, 'open');
    const item = {itemType: 'AIR'};
    component.allowNavigation = true;
    component.navigateToIssue(item);
    expect(window.open).toHaveBeenCalledWith('url', '_blank', '', false);
  });

  it('should trigger deeplink url for PBS, when itemType is PBS &  navigation issue called', () => {
    spyOn(window, 'open');
    const item = {itemType: 'PBS'};
    component.allowNavigation = true;
    component.navigateToIssue(item);
    expect(window.open).toHaveBeenCalledWith('url', '_blank', '', false);
  });
});

class ConfigurationServiceMock {
  getLinkUrl(type) {
    return of('url');
  }
}
