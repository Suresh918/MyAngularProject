import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StoreModule} from '@ngrx/store';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';

import {CaseObjectStatusCardComponent} from './case-object-status-card.component';
import {CaseObjectLabelPipe} from '../../../../pipes/case-object-label.pipe';
import {ServiceParametersService} from '../../../../../core/services/service-parameters.service';
import {metaReducers, reducers} from '../../../../../store';

describe('CaseObjectStatusCardComponent', () => {
  let component: CaseObjectStatusCardComponent;
  let fixture: ComponentFixture<CaseObjectStatusCardComponent>;
  class ServiceParametersServiceMock {
    getCaseObjectMetaData(service: string, category: string) {
      return {};
    }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectStatusCardComponent, CaseObjectLabelPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatTooltipModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: CaseObjectLabelPipe, useClass: CaseObjectLabelPipeMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectStatusCardComponent);
    component = fixture.componentInstance;
    component.caseObjectDetails = {'caseObjectStatus' : 'test'};
    component.caseObjectType = 'ChangeRequest';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Pipe({name: 'caseObjectLabel' })
class CaseObjectLabelPipeMock implements PipeTransform {
  transform(value: any, ...args): string {
    return 'label';
  }
}
