
import {FormGroup} from '@angular/forms';

export class McAssessmentWizardPiiaService extends AALWizardAssessmentService {
  assessAnswers(assessmentResult: AssessmentResult, acceptedChange: AcceptedChange): AssessmentResult {
    if (assessmentResult && assessmentResult.assessmentAnswers) {
      const yesCount = assessmentResult.assessmentAnswers.filter(assessmentAnswer => assessmentAnswer.answer === 'YES').length;
      const noCount = assessmentResult.assessmentAnswers.filter(assessmentAnswer => assessmentAnswer.answer === 'NO').length;
      const unknownCount = assessmentResult.assessmentAnswers.filter(assessmentAnswer => assessmentAnswer.answer === 'UNKNOWN').length;

      if (yesCount > 0) {
        assessmentResult.result = 'Yes';
      } else if (unknownCount > 0) {
        assessmentResult.result = 'Unknown';
      } else if (noCount > 0) {
        assessmentResult.result = 'None';
      } else {
        assessmentResult.result = '';
      }
    }
    return assessmentResult;
  }

  setFormCompleted(assessmentResult: AssessmentResult, assessmentWizardFormGroup: FormGroup): boolean {
    return assessmentResult.assessmentAnswers.filter(
      assessmentAnswer => (assessmentAnswer.answer !== null && assessmentAnswer.answer !== '')
      ).length === assessmentResult.assessmentAnswers.length;
  }
}
