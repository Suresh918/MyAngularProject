import {Component, Inject} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../../../../core/services/file.service';
import {MCAddNotesComponent} from '../add-notes.component';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {NotesService} from '../../../../core/services/notes.service';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-dialog-add-notes',
  templateUrl: './mat-dialog-add-notes.component.html',
  styleUrls: ['./mat-dialog-add-notes.component.scss']
})
export class MatDialogAddNotesComponent extends MCAddNotesComponent {
  constructor(public dialogRef: MatDialogRef<MatDialogAddNotesComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              formBuilder: FormBuilder,
              configurationService: ConfigurationService,
              helpersService: HelpersService,
              teamCenterService: FileService,
              mcFormGroupService: MCFormGroupService,
              notesService: NotesService) {
    super(formBuilder, configurationService, helpersService, teamCenterService, mcFormGroupService, notesService, dialogRef);
    super.initializeNotesComponent(data);
  }
}
