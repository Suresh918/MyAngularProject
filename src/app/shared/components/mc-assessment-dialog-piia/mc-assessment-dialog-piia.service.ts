import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MCAssessmentDialogPIIAService {
  constructor() {
  }

  assessAnswers(piiaFormGroup: FormGroup): string {
    let result = '';
    let yes = 0, no = 0, unknown = 0;
    Object.keys(piiaFormGroup.controls).forEach(key => {
      if (piiaFormGroup.get(key).value && piiaFormGroup.get(key).value === 'YES' && key !== 'preinstall_impact_result') {
        yes++;
      } else if (piiaFormGroup.get(key).value && piiaFormGroup.get(key).value === 'NO' && key !== 'preinstall_impact_result') {
        no++;
      } else if (piiaFormGroup.get(key).value && piiaFormGroup.get(key).value === 'UNKNOWN' && key !== 'preinstall_impact_result') {
        unknown++;
      }
    });
    if (yes > 0) {
      result = 'YES';
    } else if (unknown > 0) {
      result = 'Unknown';
    } else if (no > 0) {
      result = 'NONE';
    } else {
      result = '';
    }
    return result;
  }

  setFormCompleted(assessmentResult: AssessmentResult, assessmentWizardFormGroup: FormGroup): boolean {
    return assessmentResult.assessmentAnswers.filter(
      assessmentAnswer => (assessmentAnswer.answer !== null && assessmentAnswer.answer !== '')
    ).length === assessmentResult.assessmentAnswers.length;
  }
}
