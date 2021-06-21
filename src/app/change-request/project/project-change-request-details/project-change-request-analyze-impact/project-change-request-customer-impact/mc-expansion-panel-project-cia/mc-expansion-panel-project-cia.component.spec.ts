import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {McExpansionPanelProjectCiaComponent} from './mc-expansion-panel-project-cia.component';
import {ChangeRequestService} from '../../../../../change-request.service';
import {Router} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ChangeRequestFormConfiguration} from '../../../../../../shared/models/mc-configuration.model';


describe('McExpansionPanelCiaComponent', () => {
  let component: McExpansionPanelProjectCiaComponent;
  let fixture: ComponentFixture<McExpansionPanelProjectCiaComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McExpansionPanelProjectCiaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: ChangeRequestService, useClass: ChangeRequestServiceMock}, {provide: Router, useValue: mockRouter}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelProjectCiaComponent);
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

  it('should set required validator to impact_on_existing_parts control when showPartsQuestion is true', () => {
    component.changeRequestFormGroup.patchValue({id: 2});
    component.ngOnInit();
    const validator = component.changeRequestFormGroup.get('impact_analysis.impact_on_existing_parts').validator(({} as AbstractControl))
    expect(validator && validator.required).toBe(true);
  });

  it('should set required validators to customer_impact controls when showOtherPartsQuestion is true', () => {
    component.changeRequestFormGroup.patchValue({id: 3});
    component.ngOnInit();
    expect(component.ciaMandatoryFieldsAdded).toBe(true);
  });

  it('should emit changeRequestDataChanged event on updating impact_on_existing_parts control', () => {
    spyOn(component.changeRequestDataChanged, 'emit');
    component.getCIADependentFieldState({id: 1});
    expect(component.changeRequestDataChanged.emit).toHaveBeenCalled();
  });

  it('should emit changeRequestDataChanged event on updating any of the customer_impact controls', () => {
    spyOn(component.changeRequestDataChanged, 'emit');
    component.reInitializeFormGroup({id: 1});
    expect(component.changeRequestDataChanged.emit).toHaveBeenCalled();
  });

  it('should navigate to CIA details page of the CR, when CIA button is clicked', () => {
    component.openChangeImpactAssessment(123);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/change-requests/cr-customer-impact-assessment/123']);
  });

  it('should remove required validators from customer_impact controls when showPartsQuestion is false and the controls already have required validators', () => {
    component.changeRequestFormGroup.patchValue({id: 2});
    component.mandatoryFields = ['impact_analysis.customer_impact.impact_on_user_interfaces', 'impact_analysis.customer_impact.impact_on_wafer_process_environment', 'impact_analysis.customer_impact.change_to_customer_impact_critical_part'
      , 'impact_analysis.customer_impact.change_to_process_impacting_customer', 'impact_analysis.customer_impact.fco_upgrade_option_csr_implementation_change'];
    component.ciaMandatoryFieldsAdded = true;
    component.getCIADependentFieldState({id: 1});
    expect(component.ciaMandatoryFieldsAdded).toBe(false);
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
