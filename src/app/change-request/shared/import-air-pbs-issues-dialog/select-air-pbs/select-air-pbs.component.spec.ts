/*
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {of} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {SelectAirPbsComponent} from './select-air-pbs.component';
import {AirSearchService} from '../../../../core/services/air-search.service';
import {PbsSearchService} from '../../../../core/services/pbs-search.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {Problems} from "../../../../shared/models/mc-presentation.model";

describe('SelectAirPbsComponent', () => {
  let component: SelectAirPbsComponent;
  let fixture: ComponentFixture<SelectAirPbsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAirPbsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatSnackBarModule, HttpClientModule],
      providers: [
        {provide: AirSearchService, useClass: AirSearchServiceMock},
        {provide: PbsSearchService, useClass: PbsSearchServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAirPbsComponent);
    component = fixture.componentInstance;
    component.createFrom = 'air';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /!*it('should set createFrom, when ngOnInit is triggered', () => {
    component.linkedPbsIds = ['1'];
    component.ngOnInit();
    expect(component.createFrom).toEqual('air');
  });

  it('should trigger AIR search service, when user inputs an id whose length is more than 4 characters', () => {
    jasmine.clock().install();
    component.ngOnInit();
    component.airSearchControl.patchValue('123456');
    fixture.detectChanges();
    jasmine.clock().tick(1000);
    fixture.detectChanges();
    jasmine.clock().uninstall();
    expect(component.airSearchResults.length).toEqual(1);
  });*!/
});

class AirSearchServiceMock {
  findAIRByID$(id) {
    return of([{number: '1234561'}, {number: '1234562'}, {number: '1234560'}] as Problems[]);
  }
}

class PbsSearchServiceMock {
  findPBSByID$(id) {
    return of([]);
  }
}
*/
