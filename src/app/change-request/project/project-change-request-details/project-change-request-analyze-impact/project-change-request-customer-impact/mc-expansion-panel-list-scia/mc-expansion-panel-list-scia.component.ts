import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActionService} from '../../../../../../core/services/action.service';
import {ConfigurationService} from '../../../../../../core/services/configurations/configuration.service';
import {UserPermissionService} from '../../../../../../core/services/user-permission.service';
import {MyTeamService} from '../../../../../../my-team/my-team.service';
import {ChangeRequestService} from '../../../../../change-request.service';
import {CreateSciaDialogComponent} from '../create-scia-dialog/create-scia-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {myTeamListValue} from '../../../../../store';
import {MiraiUser} from '../../../../../../shared/models/mc.model';
import {Store} from '@ngrx/store';
import {ChangeRequestListState} from '../../../../../../shared/models/mc-store.model';

@Component({
  selector: 'mc-expansion-panel-list-scia',
  templateUrl: './mc-expansion-panel-list-scia.component.html',
  styleUrls: ['./mc-expansion-panel-list-scia.component.scss']
})
export class McExpansionPanelListSciaComponent implements OnInit {

  @Input() caseObject;
  @Input() uploadAllowed: boolean;
  @Input() isExpanded: boolean;
  public sciaList: any[];
  public emptyStateData: TemplateRef<any>;
  public progressBar: boolean;
  public sciaLink: string;
  private usersList: any[];
  public showLoader: boolean;

  constructor(
    private readonly userPermissionService: UserPermissionService,
    private readonly matDialog: MatDialog,
    private readonly myTeamService: MyTeamService,
    private readonly changeRequestService: ChangeRequestService,
    private readonly actionService: ActionService,
    private readonly configurationService: ConfigurationService,
    private readonly customAlert: MatSnackBar,
    private readonly changeRequestListStore: Store<ChangeRequestListState>
  ) {
    this.sciaList = [];
    this.usersList = [];
    this.showLoader = false;
    this.sciaLink = this.configurationService.getLinkUrl('SCIA');
  }

  public ngOnInit(): void {
    if (this.caseObject && this.caseObject.id) {
      this.getSciaList(this.caseObject.id);
      this.processMyTeamData();
    }
  }

  public openCreateSciaDialog(): void {
    let dialogRef: MatDialogRef<CreateSciaDialogComponent>;
    dialogRef = this.matDialog.open(CreateSciaDialogComponent, {
      width: '80rem',
      disableClose: true,
      data: {
        title: 'Create SCIA',
        mode: 'add',
        myTeamList: this.usersList.length > 0 ? [...this.usersList] : []
      },
      position: {top: '10rem'} as DialogPosition
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const payload = this.getPayload(this.caseObject, result.plmpcCoordinator);
        this.showLoader = true;
        this.changeRequestService.createScia(this.caseObject.id, payload).subscribe((res) => {
          this.sciaList.unshift(res);
          this.showLoader = false;
          this.addUserToMyTeam(result.plmpcCoordinator);
          this.createAction(this.caseObject, result.plmpcCoordinator, res.id);
        },
        () => {
          this.customAlert.open('Error while creating scia.', '', {duration: 2000});
          this.showLoader = false;
        });
      }
    });
  }

  private addUserToMyTeam(user): void {
    const existingUserIndex = this.usersList.findIndex((item) => item.member.user.user_id === user.user_id);
    if (existingUserIndex === -1) {
      this.myTeamService.addMyTeamMember(this.getTeamUserPayload(user), this.caseObject.my_team.id, 'ChangeRequest')
        .subscribe((membersResult) => {
          if (Object.keys(membersResult).length > 0) {
            const newUser = {
              'member': {
                'user': {
                  'roles': []
                },
                'roles': []
              }
            };
            newUser['member']['id'] = membersResult.id;
            newUser['member']['user'] = membersResult.user;
            newUser['member']['user']['roles'] = ['coordinatorSCMPLM'];
            newUser['member']['roles'] = membersResult.roles;
            this.usersList.push(newUser);
            this.changeRequestListStore.dispatch(myTeamListValue(this.usersList));
          }
        }
      );
    }
  }

  private getPayload(data, user) {
    const payload = {};
    payload['title'] = 'New Scia';
    payload['contexts'] = [];
    payload['plm_coordinator'] = {};
    payload['plm_coordinator'] = new MiraiUser(user);
    payload['contexts'].push({
      'type': 'CHANGEREQUEST',
      'context_id': data.id,
      'name': data.title,
      'status': data.status
    });
    payload['my_team_details'] = null;
    return payload;
  }

  public copyScia(sciaId: string): void {
    this.showLoader = true;
    this.changeRequestService.copyScia(this.caseObject.id, sciaId).subscribe(
      (res) => {
        this.showLoader = false;
        this.sciaList.unshift(res);
      },
      () => {
        this.showLoader = false;
        this.customAlert.open('Error while cloning scia.', '', {duration: 2000});
      }
    );
  }

  navigateToSCIA(sciaID: string): void {
    window.open(`${this.sciaLink}${sciaID}`, '_blank', '', false);
  }

  private getSciaList(changeRequestId: string): void {
    this.changeRequestService.getSciaList(changeRequestId).subscribe(
      (res) => {
        if (res) {
          this.sciaList = res;
        }
      }
    );
  }

  private processMyTeamData(): void {
    this.usersList = [];
    const usersList = [];
    if (this.caseObject.my_team && this.caseObject.my_team.members && this.caseObject.my_team.members.length > 0) {
      this.caseObject.my_team.members.forEach(listItem => {
        if (listItem.member['user'] && listItem.member['user']['user_id']) {
          listItem.member['user']['roles'] = listItem.member['roles'] ? listItem.member['roles'] : [];
          usersList.push({'member': listItem.member});
        }
      });
      this.usersList = usersList;
    }
  }

  private createAction(caseObject, user, sciaId) {
    const payload = this.getCreateActionPaylod(caseObject, user, sciaId);
    this.actionService.createAction(payload.LinkElement, payload.ActionElement, 'SUBMIT', 'SUBMIT').subscribe();
  }

  private getCreateActionPaylod(caseObject, user, sciaId) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return {
      'ActionElement': {
        'generalInformation': {
          'title': `<p>Release <a href='${this.sciaLink}${sciaId}' target='_blank'>SCIA</a> in myChange</p>`
        },
        'type': 'Supply Chain Management',
        'deadline': date,
        'assignee': {
          'userID': user.user_id,
          'fullName': user.full_name,
          'email': user.email,
          'abbreviation': user.abbreviation,
          'departmentName': user.department_name
        }
      },
      'LinkElement': {
        'ID': caseObject.id,
        'type': 'ChangeRequest',
        'status': caseObject.status,
        'title': caseObject.title
      }
    };
  }

  private getTeamUserPayload(user) {
    const payload = {
      'user': {},
      'roles': []
    };
    payload['user'] = user;
    payload['roles'] = ['coordinatorSCMPLM'];
    delete payload['user']['photoURL'];
    delete payload['user']['roles'];

    return payload;
  }
}
