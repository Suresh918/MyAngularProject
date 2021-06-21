import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';

import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {environment} from '../../../../../environments/environment';
import {NotificationConfiguration} from '../../../../settings/notification-settings/notification-settings.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationSettingsService {
  notificationsUrl: string;
  azureUrl: string;
  notificationsData: any;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly http: HttpClient,
              private readonly mcFormGroupService: MCFormGroupService) {
    this.notificationsUrl = `${environment.rootURL}mc/v0.1/notifications/configuration`;
    this.azureUrl = `${environment.rootURL}notification-service`;
  }

  createNotificationConfigurationFormGroup(data: NotificationConfiguration): FormGroup {
    data = data || {};
    return this.formBuilder.group({
      addedToMyTeamCRCNRP: this.createSituationFormGroup(data.addedToMyTeamCRCNRP),
      removedFromMyTeamCRCNRP: this.createSituationFormGroup(data.removedFromMyTeamCRCNRP),
      myTeamInCNRPReviewCompleted: this.createSituationFormGroup(data.myTeamInCNRPReviewCompleted),
      crStatusChangedToDraft: this.createSituationFormGroup(data.crStatusChangedToDraft),
      cs2CreatedRP: this.createSituationFormGroup(data.cs2CreatedRP),
      cs1InCRReceivedNewCR: this.createSituationFormGroup(data.cs1InCRReceivedNewCR),
      cs2InCNRPReviewInitiated: this.createSituationFormGroup(data.cs2InCNRPReviewInitiated),
      cs2InCNRPReviewCompleted: this.createSituationFormGroup(data.cs2InCNRPReviewCompleted),
      cs2InCNRPReviewStartValidation: this.createSituationFormGroup(data.cs2InCNRPReviewStartValidation),
      crStatusChangedToNew: this.createSituationFormGroup(data.crStatusChangedToNew),
      crStatusChangedToSolutionDefined: this.createSituationFormGroup(data.crStatusChangedToSolutionDefined),
      crStatusChangedToImpactAnalyzed: this.createSituationFormGroup(data.crStatusChangedToImpactAnalyzed),
      crStatusChangedToApproved: this.createSituationFormGroup(data.crStatusChangedToApproved),
      crStatusChangedToRejected: this.createSituationFormGroup(data.crStatusChangedToRejected),
      crStatusChangedToClosed: this.createSituationFormGroup(data.crStatusChangedToClosed),
      crStatusChangedToObsoleted: this.createSituationFormGroup(data.crStatusChangedToObsoleted),
      cnStatusChangedToDraft: this.createSituationFormGroup(data.cnStatusChangedToDraft),
      cnStatusChangedToNew: this.createSituationFormGroup(data.cnStatusChangedToNew),
      cnStatusChangedToPlanned: this.createSituationFormGroup(data.cnStatusChangedToPlanned),
      cnStatusChangedToImplemented: this.createSituationFormGroup(data.cnStatusChangedToImplemented),
      cnStatusChangedToObsoleted: this.createSituationFormGroup(data.cnStatusChangedToObsoleted),
      rpStatusChangedToNew: this.createSituationFormGroup(data.rpStatusChangedToNew),
      rpStatusChangedToCreated: this.createSituationFormGroup(data.rpStatusChangedToCreated),
      rpStatusChangedToReadyForRelease: this.createSituationFormGroup(data.rpStatusChangedToReadyForRelease),
      rpStatusChangedToReleased: this.createSituationFormGroup(data.rpStatusChangedToReleased),
      rpStatusChangedToClosed: this.createSituationFormGroup(data.rpStatusChangedToClosed),
      rpStatusChangedToObsoleted: this.createSituationFormGroup(data.rpStatusChangedToObsoleted),
      assigneeInActionAssigned: this.createSituationFormGroup(data.assigneeInActionAssigned),
      assigneeInActionDueSoon: this.createSituationFormGroup(data.assigneeInActionDueSoon),
      creatorInActionRejected: this.createSituationFormGroup(data.creatorInActionRejected),
      creatorInActionModified: this.createSituationFormGroup(data.creatorInActionModified),
      creatorInActionCompleted: this.createSituationFormGroup(data.creatorInActionCompleted),
      assigneeInOverdueAction: this.createSituationFormGroup(data.assigneeInOverdueAction)
    });
  }

  createSituationFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      caseType: [data.caseType || ''],
      delegate: this.mcFormGroupService.createUserFormControl(data.delegate),
      // delegate: this.formBuilder.array(data.delegate.map(res => this.createUserFormGroup(res))),
      // delegate: this.createUserFormGroup(data.delegate),
      // distribution: this.formBuilder.array(data.distribution.map(res => this.createDistributionFormGroup(res))),
      distribution: this.formBuilder.array(data.distribution ? data.distribution.map(res => this.createDistributionFormGroup(res)) : [])
      // distribution: this.createDistributionFormGroup(data.distribution)
    });
  }

  createDistributionFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      channel: [data.channel || ''],
      frequency: [data.frequency || ''],
      isEnabled: [data.isEnabled || false],
      isDisabled: [data.isDisabled] || false
    });
  }

  createUserFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      userID: [data.userID || ''],
      fullName: [data.fullName || ''],
      email: [data.email || ''],
      abbreviation: [data.abbreviation || ''],
      departmentName: [data.departmentName || ''],
    });
  }


  createReviewNotificationConfigurationFormGroup(data): FormGroup {
    data = data || [];
    return this.formBuilder.group({
      ReviewExecutor: this.formBuilder.array(data.ReviewExecutor ? data.ReviewExecutor.map(res => this.createReviewEventFormGroup(res)) : []),
      ReviewTaskAssignee: this.formBuilder.array(data.ReviewTaskAssignee ? data.ReviewTaskAssignee.map(res => this.createReviewEventFormGroup(res)) : []),
      ReviewEntryAssignee: this.formBuilder.array(data.ReviewEntryAssignee ? data.ReviewEntryAssignee.map(res => this.createReviewEventFormGroup(res)) : []),
      RPMyTeamReview: this.formBuilder.array(data.RPMyTeamReview ? data.RPMyTeamReview.map(res => this.createReviewEventFormGroup(res)) : []),
      MyTeamMember: this.formBuilder.array(data.MyTeamMember ? data.MyTeamMember.map(res => this.createReviewEventFormGroup(res)) : []),
      CRMyTeamMember: this.formBuilder.array(data.CRMyTeamMember ? data.CRMyTeamMember.map(res => this.createReviewEventFormGroup(res)) : []),
      CrMyTeamMemberGeneral: this.formBuilder.array(data.CrMyTeamMemberGeneral ? data.CrMyTeamMemberGeneral.map(res => this.createReviewEventFormGroup(res)) : []),
      CrChangeSpecialist1: this.formBuilder.array(data.CrChangeSpecialist1 ? data.CrChangeSpecialist1.map(res => this.createReviewEventFormGroup(res)) : []),
      RPMyTeamMember: this.formBuilder.array(data.RPMyTeamMember ? data.RPMyTeamMember.map(res => this.createReviewEventFormGroup(res)) : []),
      RPMyTeamMemberGeneral: this.formBuilder.array(data.RPMyTeamMemberGeneral ? data.RPMyTeamMemberGeneral.map(res => this.createReviewEventFormGroup(res)) : []),
      RPExecutor: this.formBuilder.array(data.RPExecutor ? data.RPExecutor.map(res => this.createReviewEventFormGroup(res)) : []),
      ChangeSpecialist1: this.formBuilder.array(data.ChangeSpecialist1 ? data.ChangeSpecialist1.map(res => this.createReviewEventFormGroup(res)) : []),
      ChangeSpecialist2: this.formBuilder.array(data.ChangeSpecialist2 ? data.ChangeSpecialist2.map(res => this.createReviewEventFormGroup(res)) : []),
      Executor: this.formBuilder.array(data.Executor ? data.Executor.map(res => this.createReviewEventFormGroup(res)) : []),

    });
  }

  createReviewEventFormGroup(data) {
    data = data || [];
    return this.formBuilder.group({
      event: [data.event || ''],
      event_name: [data.event_name || ''],
      sequence: [isNaN(data.sequence) ? '' : data.sequence],
      role: [data.role || ''],
      in_app_channel: this.createChannelFormGroup(data.in_app_channel),
      email_channel: this.createChannelFormGroup(data.email_channel)
    });
  }

  createChannelFormGroup(data) {
    data = data || [];
    return this.formBuilder.group({
      enabled: [data.enabled || false],
      frequency: [data.frequency || ''],
      isEnabled: [data.isEnabled || false],
      isDisabled: [data.isDisabled] || false
    });
  }

  getNotificationConfigurations(): Observable<NotificationConfiguration> {
    return this.http.get(this.notificationsUrl).pipe(map(res => {
      return res ? res : {} as NotificationConfiguration;
    }));
  }

  saveNotificationData(notificationsData) {
    this.notificationsData = notificationsData;
  }

  getNotificationConfigurationsData() {
    return this.notificationsData['notificationConfiguration'] ? this.notificationsData['notificationConfiguration'] : {} as NotificationConfiguration;
  }

  updateNotificationConfigurations(notificationConfiguration: NotificationConfiguration): Observable<NotificationConfiguration> {
    const payload = {
      'notificationConfiguration': notificationConfiguration
    };
    return this.http.put(this.notificationsUrl, payload).pipe(map(res => {
      return res ? res : {} as NotificationConfiguration;
    }));
  }

  getReviewNotificationConfiguration(userId: string): Observable<any> {
    return this.http.get(`${this.azureUrl}/settings/${userId}`).pipe(map(res => {
      return res ? res : {};
    }));
  }

  updateReviewNotificationConfiguration(reviewNotificationConfiguration: any, userId: string): Observable<any> {
    const payLoad = {
      ...(reviewNotificationConfiguration ? reviewNotificationConfiguration : {})
    };
    return this.http.put(`${this.azureUrl}/settings/${userId}`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }
}
