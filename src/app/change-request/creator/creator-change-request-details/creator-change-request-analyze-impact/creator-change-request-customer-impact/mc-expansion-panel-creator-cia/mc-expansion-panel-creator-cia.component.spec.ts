import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {McExpansionPanelCreatorCiaComponent} from './mc-expansion-panel-creator-cia.component';
import {FormControl, FormGroup} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ChangeRequestService} from '../../../../../change-request.service';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {ChangeRequestFormConfiguration} from '../../../../../../shared/models/mc-configuration.model';


describe('McExpansionPanelCiaComponent', () => {
  let component: McExpansionPanelCreatorCiaComponent;
  let fixture: ComponentFixture<McExpansionPanelCreatorCiaComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McExpansionPanelCreatorCiaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: ChangeRequestService, useClass: ChangeRequestServiceMock}, {provide: Router, useValue: mockRouter}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelCreatorCiaComponent);
    component = fixture.componentInstance;
    component.mandatoryFields = [];
    component.impactAssesmentControls = ['impact_analysis.customer_impact.impact_on_user_interfaces', 'impact_analysis.customer_impact.impact_on_wafer_process_environment', 'impact_analysis.customer_impact.change_to_customer_impact_critical_part'
      , 'impact_analysis.customer_impact.change_to_process_impacting_customer', 'impact_analysis.customer_impact.fco_upgrade_option_csr_implementation_change'];
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(1),
      status: new FormControl(4),
      impact_analysis: new FormGroup({
        impact_on_existing_parts: new FormControl('No'),
        customer_impact: new FormGroup({
          impact_on_user_interfaces: new FormControl(null),
          impact_on_wafer_process_environment: new FormControl(null),
          change_to_customer_impact_critical_part: new FormControl(null),
          change_to_process_impacting_customer: new FormControl(null),
          fco_upgrade_option_csr_implementation_change: new FormControl(null),
          customer_impact_result: new FormControl('MINOR')
        })
      })
    });
    component.caseObject = {
      ID: '1',
      revision: '',
      type: 'ChangeRequest'
    };
    component.changeRequestConfiguration = {
      impact_analysis: {
        customer_impact: {
          customer_impact_result: {
            options: [{label: 'Minor', value: 'MINOR'}, {label: 'Major', value: 'MAJOR'}, {label: 'None', value: 'NA'}]
          }
        }
      }
    } as ChangeRequestFormConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to CIA details page of the CR, when CIA button is clicked', () => {
    component.openChangeImpactAssessment(123);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/change-requests/cr-customer-impact-assessment/123']);
  });
});

class ChangeRequestServiceMock {
  getCIADependentFieldState$(id, servicePath) {
    switch (id) {
      case 1: return of({
        show_existing_part_question: false,
        show_other_questions: false
      });
      case 2: return of({
        show_existing_part_question: true,
        show_other_questions: false
      });
      case 3: return of({
        show_existing_part_question: true,
        show_other_questions: true
      });
    }
  }
}
