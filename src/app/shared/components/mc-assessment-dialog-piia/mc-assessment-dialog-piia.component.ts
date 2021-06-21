import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {MCAssessmentDialogPIIAService} from './mc-assessment-dialog-piia.service';
import {loadCaseObject} from '../../../store/actions/case-object.actions';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {ChangeRequest} from '../../models/mc.model';

@Component({
  selector: 'mc-assessment-dialog-piia',
  templateUrl: './mc-assessment-dialog-piia.component.html',
  styleUrls: ['./mc-assessment-dialog-piia.component.scss']
})
export class MCAssessmentDialogPIIAComponent implements OnInit {
  caseObjectId: string;
  piiaFormGroup: FormGroup;
  piiaFormConfiguration: FormControlConfiguration;
  progressBar: boolean;
  fontSize: string;
  questionsKeyList: string[] = [
    'change_introduces_new11_nc',
    'change_replaces_mentioned_parts',
    'impact_on_customer_factory_layout',
    'impact_on_facility_flows',
    'impact_on_preinstall_inter_connect_cables',
  ];
  piiaResult: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private readonly changeRequestService: ChangeRequestService,
              private readonly appStore: Store<MyChangeState>,
              private readonly piiaService: MCAssessmentDialogPIIAService,
              public dialogRef: MatDialogRef<MCAssessmentDialogPIIAComponent>) {
  }


  ngOnInit(): void {
    this.piiaFormGroup = this.data.piiaFormGroup;
    this.piiaFormConfiguration = this.data.piiaFormConfiguration;
    if (this.piiaFormGroup.get('preinstall_impact_result').value) {
      this.piiaResult = this.piiaFormConfiguration['preinstall_impact_result'].options.filter(option => (option.value === this.piiaFormGroup.get('preinstall_impact_result').value))[0].label;
    }
    this.caseObjectId = this.data.caseObjectId;
    this.subscribeToLabelChanges();
  }

  close() {
    this.dialogRef.close();
  }

  onSave() {
    this.changeRequestService.updatePreInstallImpactData$(this.piiaFormGroup.get('id').value, this.getPayload())
      .subscribe((response: ChangeRequest) => {
        if (response) {
          this.dialogRef.close(response.impact_analysis.preinstall_impact.preinstall_impact_result);
        }
      });
  }

  getPayload() {
    const payload = {};
    payload['preinstall_impact_result'] = this.piiaFormGroup.get('preinstall_impact_result').value;
    this.questionsKeyList.forEach((questionKey) => {
      payload[questionKey] = this.piiaFormGroup.get(questionKey).value;
      payload[questionKey + '_details'] = this.piiaFormGroup.get(questionKey + '_details').value;
    });
    return payload;
  }

  onAssessmentChanges($event) {
    this.piiaFormGroup.get('preinstall_impact_result').setValue(this.piiaService.assessAnswers(this.piiaFormGroup));
  }

  subscribeToLabelChanges() {
    this.piiaFormGroup.get('preinstall_impact_result').valueChanges.subscribe(controlValue => {
      if (controlValue) {
        this.piiaResult = this.piiaFormConfiguration['preinstall_impact_result'].options.filter(option => (option.value === controlValue))[0].label;
      }
    });
  }

}
