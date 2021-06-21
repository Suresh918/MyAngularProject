import {FormGroup} from '@angular/forms';


export class MCAssessmentWizardCIAService extends AALWizardAssessmentService {
  assessAnswers(assessmentResult: AssessmentResult, acceptedChange: AcceptedChange): AssessmentResult {
    if (assessmentResult && assessmentResult.applicabilityCheck) {
      if (assessmentResult.applicabilityCheck.answer === 'NO') {
        assessmentResult.result = 'N/A';
      } else if (assessmentResult.applicabilityCheck.answer === '') {
        assessmentResult.result = '';
      } else {
        const assessmentAnswerFilledWithYesOrNotApplicable: AssessmentAnswer[] = assessmentResult.assessmentAnswers.filter(
          assessmentAnswer => assessmentAnswer.answer === 'YES' || assessmentAnswer.answer === 'NA'
        );
        if (assessmentAnswerFilledWithYesOrNotApplicable.length > 0) {
          assessmentResult.result = 'Major';
        } else {
          assessmentResult.result = 'Minor';
        }
      }
    }
    return assessmentResult;
  }

  setFormCompleted(assessmentResult: AssessmentResult, assessmentWizardFormGroup: FormGroup): boolean {
    if (assessmentResult) {
      if (assessmentResult.applicabilityCheck && assessmentResult.applicabilityCheck.answer === 'NO') {
        return true;
      }
      if (!assessmentResult.applicabilityCheck || assessmentResult.applicabilityCheck.answer === 'YES' || assessmentResult.applicabilityCheck.answer === 'UNKNOWN') {
        return assessmentResult.assessmentAnswers
          .filter(assessmentAnswer =>
            assessmentAnswer.answer === null ||
            assessmentAnswer.answer === '' ||
            assessmentAnswer.answer === undefined).length <= 0;
      }
    }
  }
}
