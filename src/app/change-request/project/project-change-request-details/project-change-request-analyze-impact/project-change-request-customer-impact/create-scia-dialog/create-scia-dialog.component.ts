import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MCFormGroupService } from '../../../../../../core/utilities/mc-form-group.service';
import { FormControlConfiguration } from '../../../../../../shared/models/mc-configuration.model';

@Component({
  selector: 'mc-create-scia-dialog',
  templateUrl: './create-scia-dialog.component.html',
  styleUrls: ['./create-scia-dialog.component.scss']
})
export class CreateSciaDialogComponent implements OnInit {

  public sciaFormGroup: FormGroup;
  public sciaFormConfiguration: FormControlConfiguration;
  public plmpcUsers: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialog: MatDialog,
    public readonly dialogRef: MatDialogRef<CreateSciaDialogComponent>,
    private readonly mcFormGroupService: MCFormGroupService,
    private readonly formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.getPlmpcUsers();
    this.sciaFormConfiguration = {
      'label': 'Product Lifecycle Management Project Coordinator (PLM PC)',
      'help': 'Info'
    };
    if (this.plmpcUsers.length === 1) {
      this.sciaFormGroup = this.formBuilder.group({
        'plmpcUser': [this.plmpcUsers[0]]
      });
    } else {
      this.sciaFormGroup = this.formBuilder.group({
        'plmpcUser': [{}]
      });
    }
  }

  private getPlmpcUsers(): void {
    this.plmpcUsers = [];
    const users = this.data.myTeamList;
    users.forEach(user => {
      if (user.member && user.member.roles) {
        user.member.roles.forEach(role => {
          if (role === 'coordinatorSCMPLM') {
            this.plmpcUsers.push(user.member.user);
          }
        });
      }
    });
  }

  public createScia(): void {
    const selectedUser = this.sciaFormGroup.get('plmpcUser').value;
    selectedUser['roles'] = ['coordinatorSCMPLM'];
    this.dialogRef.close({
      'plmpcCoordinator': selectedUser
    });
  }

  public cancelCreateScia(): void {
    this.dialogRef.close();
  }
}
