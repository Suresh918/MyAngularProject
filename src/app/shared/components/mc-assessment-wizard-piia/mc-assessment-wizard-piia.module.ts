import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MCAssessmentWizardPiiaComponent} from './mc-assessment-wizard-piia.component';

@NgModule({
  declarations: [MCAssessmentWizardPiiaComponent],
  imports: [
    CommonModule,
    AALWizardAssessmentDialogModule,
    MatButtonModule
  ],
  exports: [
    MCAssessmentWizardPiiaComponent
  ]
})
export class McAssessmentWizardPiiaModule {
}
