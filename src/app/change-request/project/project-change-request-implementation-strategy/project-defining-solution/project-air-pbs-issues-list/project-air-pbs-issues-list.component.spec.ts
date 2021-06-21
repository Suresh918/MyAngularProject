import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {MatMenuModule} from '@angular/material/menu';
import {ProjectAirPbsIssuesListComponent} from './project-air-pbs-issues-list.component';


describe('ProjectAirPbsIssuesListComponent', () => {
  let component: ProjectAirPbsIssuesListComponent;
  let fixture: ComponentFixture<ProjectAirPbsIssuesListComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAirPbsIssuesListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientModule, MatMenuModule],
      providers: [
        {provide: ConfigurationService, useClass: ConfigurationServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAirPbsIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open new window and navigate to AIR system, when an AIR item is selected', () => {
    spyOn(window, 'open');
    component.itemSelected({number: 1}, 'air');
    expect(window.open).toHaveBeenCalledWith('air1', '_blank');
  });

  it('should open new window and navigate to PBS system, when a PBS item is selected', () => {
    spyOn(window, 'open');
    component.itemSelected({ID: 1}, 'pbs');
    expect(window.open).toHaveBeenCalledWith('pbs1', '_blank');
  });

  it('should set listItems when getItems is triggered', () => {
    component.items = [{id: 1 , type: 'air'}];
    component.getItems();
    expect(component.listItems.length).toEqual(1);
  });

});

class ConfigurationServiceMock {
  getLinkUrl(linkName) {
    switch (linkName) {
      case 'AIR': return 'air';
      case 'PBS': return 'pbs';
    }
    return '';
  }
}
