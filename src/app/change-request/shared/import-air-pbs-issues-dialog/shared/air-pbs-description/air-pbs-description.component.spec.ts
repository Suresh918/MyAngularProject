import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {of} from 'rxjs';
import {AirPbsDescriptionComponent} from './air-pbs-description.component';
import {FormControl, FormGroup} from "@angular/forms";


describe('AirPbsDescriptionComponent', () => {
  let component: AirPbsDescriptionComponent;
  let fixture: ComponentFixture<AirPbsDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AirPbsDescriptionComponent],
      providers: [{provide: ConfigurationService, useClass: ConfigurationServiceMock}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirPbsDescriptionComponent);
    component = fixture.componentInstance;
    component.importContentFormConfiguration = {options: [{value: 'LINK_ONLY'}]};
    component.portationFormGroup = new FormGroup({
      action: new FormControl('FCO')
    });
    // component.importDataSelectConfiguration = {options: [{value: 'LINK_ONLY'}]};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addIssueEvent when item is added', () => {
    spyOn(component.addIssueEvent, 'emit');
    component.issueItem = {selected: true};
    component.addIssue();
    expect(component.addIssueEvent.emit).toHaveBeenCalled();
  });

  it('should update issueItem object', () => {
    component.issueItem = {action: ''};
    const selectionValue = 'abc';
    component.addActionToItems(selectionValue);
    expect(component.issueItem.action).toBe('abc');
  });

  it('should emit removeIssueEvent when item is deleted', () => {
    spyOn(component.deleteIssueEvent, 'emit');
    component.issueItem = {selected: true};
    component.deleteIssue();
    expect(component.deleteIssueEvent.emit).toHaveBeenCalled();
  });

  it('should trigger deeplink url for AIR, when itemType is AIR & navigation issue called', () => {
    spyOn(window, 'open');
    const type = 'AIR';
    component.allowNavigation = true;
    component.navigateToIssue(type);
    expect(window.open).toHaveBeenCalledWith('url', '_blank', '', false);
  });

  it('should trigger deeplink url for PBS, when itemType is PBS &  navigation issue called', () => {
    spyOn(window, 'open');
    const type = 'PBS';
    component.allowNavigation = true;
    component.navigateToIssue(type);
    expect(window.open).toHaveBeenCalledWith('url', '_blank', '', false);
  });

  it('should return projectID when itemType is pbs', () => {
    const item = {type: 'pbs', projectID: '12345'};
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('12345');
  });

  it('should return Owner Name when itemType is air', () => {
    const item = {
      type: 'air', projectID: '12345',
      owner: {
        abbreviation: 'Q04T',
        department_name: '',
        email: 'q04test@example.qas',
        full_name: 'Q 04test',
        userID: 'q04test'
      }
    };
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('Q 04test - Q04T');
  });

  it('should return empty when itemType is null', () => {
    const item = {type: null, projectID: '12345'};
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('');
  });

  it('should return true, if itemType is pbs', () => {
    const item = {type: 'pbs'};
    const returnValue = component.checkForPbs(item);
    expect(returnValue).toBe(true);
  });

  it('should return true, if itemType is air', () => {
    const item = {type: 'air'};
    const returnValue = component.checkForAir(item);
    expect(returnValue).toBe(true);
  });
});

class ConfigurationServiceMock {
  getLinkUrl(type) {
    return of('url');
  }
}
