import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {FormControlConfiguration, UserFormConfiguration} from '../../models/mc-configuration.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {User} from '../../models/mc.model';

@Component({
  selector: 'mc-mat-dialog-input-user-search',
  templateUrl: './mat-dialog-input-user-search.component.html',
  styleUrls: ['./mat-dialog-input-user-search.component.scss']
})
export class MatDialogInputUserSearchComponent implements OnInit {
  userSearchControl: FormControl;
  usersControlConfiguration: any;
  helpText: string;
  userRoles: any;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly userProfileService: UserProfileService,
              public dialogRef: MatDialogRef<MatDialogInputUserSearchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userSearchControl = new FormControl([]);
    this.usersControlConfiguration = this.data.myTeamConfiguration;
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(null);
  }

  setUserList(): void {
    const qParams: string[] = [];
    this.userSearchControl.value.forEach((user) => {
      qParams.push(user['userID']);
    });
    if (this.data && this.data.caseObjectType === 'change-requests' || this.data.caseObjectType === 'release-packages') {
      this.userProfileService.getUserRoleDetails(qParams.toString(), this.getCaseObjectFromURL(this.data.caseObjectType)).subscribe(res => {
        if (res && res.length) {
        this.userRoles =  this.formatRolesObject(res);
        }
        this.dialogRef.close(this.userRoles);
      });
    } else {
      this.userProfileService.updateUserPermissions(qParams.toString()).subscribe((resp) => {
        this.dialogRef.close(resp);
      });
    }
  }

  formatRolesObject(userRolesArray) {
    const permissionsObject = {};
    const permissions = [];
    userRolesArray.forEach(item => {
      const object = {};
      object['id'] = item.id;
      object['addedToMyMates'] = item.added_to_my_team;
      object['otherRoles'] = item.other_roles;
      object['preferredRoles'] = item.preferred_roles;
      object['roles'] = item.roles;
      object['groups'] = item.groups;
      object['user'] = new User(item.user);

      permissions.push(object);
    });
    permissionsObject['permissions'] = permissions;
    return permissionsObject;
  }

  getCaseObjectFromURL(url: string): string {
    switch (url) {
      case 'change-requests':
        return 'ChangeRequest';
      case 'release-packages':
        return 'ReleasePackage';
    }
  }
}
