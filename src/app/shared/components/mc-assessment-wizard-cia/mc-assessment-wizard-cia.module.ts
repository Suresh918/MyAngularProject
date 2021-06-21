import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

import {MCAssessmentWizardCiaComponent} from './mc-assessment-wizard-cia.component';

@NgModule({
  declarations: [MCAssessmentWizardCiaComponent],
  imports: [
    CommonModule,
    AALWizardAssessmentDialogModule,
    MatButtonModule
  ],
  exports: [
    MCAssessmentWizardCiaComponent
  ]
})
export class MCAssessmentWizardCIAModule {
}
