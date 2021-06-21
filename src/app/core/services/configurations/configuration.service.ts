import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ManageProductsAffectedService} from './services/products-affected.service';
import {LinksService} from './services/links.service';
import {FormsConfigurationService} from './services/forms-configuration.service';
import {NotificationSettingsService} from './services/notification-settings.service';
import {forkJoin} from 'rxjs';
import {UserProfileService, UserRole} from './services/user-profile.service';
import {UserProfileService as UP} from '../user-profile.service';
import {PreferredRolesService} from './services/preferred-roles.service';


@Injectable({
  'providedIn': 'root'
})
export class ConfigurationService {
  rootServiceUrl: string;

  constructor(public readonly userProfileService: UserProfileService,
              public readonly userProfileService1: UP,
              public readonly formsConfigurationService: FormsConfigurationService,
              public readonly notificationSettingsService: NotificationSettingsService,
              public readonly preferredRolesService: PreferredRolesService,
              public readonly productsAffectedService: ManageProductsAffectedService,
              public readonly linksService: LinksService) {
    this.rootServiceUrl = `${environment.rootURL}configuration-service/`;
  }

  /* ------------------------------------ Common Service Interface -----------------------------------*/

  loadConfigurationServices(): Promise<void> {
    return new Promise((resolve) => {
      const serviceList = [
        this.userProfileService.getUserProfile(),
        this.userProfileService1.getStates(),
        this.formsConfigurationService.getForms(),
        this.preferredRolesService.getPreferredRoles(), // needed to check if user has preferred roles to show banner
        this.linksService.getLinks() // Get links needed especially UserPhoto URL when load
      ];
      forkJoin(serviceList).subscribe(resList => {
        resolve();
        this.userProfileService.setUserProfile(resList[0]);
        this.userProfileService1.saveStateData(resList[1]);
        this.formsConfigurationService.saveFormData(resList[2]);
        this.preferredRolesService.savePreferredRolesData(resList[3]);
        this.linksService.saveLinkData(resList[4]);
      });
    });
  }

  /* ------------------------------------ Link Service Interface -----------------------------------*/
  getLinks() {
    return this.linksService.getLinksData();
  }

  getLinkUrl(linkName: string): string {
    return this.linksService.getLinksUrl(linkName);
  }

  getFormData(name: string) {
    return this.formsConfigurationService.getFromDataParam(name);
  }
  /* ------------------------------------ Notifications Service Interface -----------------------------------*/
  getNotificationConfigurations() {
    return this.notificationSettingsService.getNotificationConfigurationsData();
  }

  /* ------------------------------------ Form Service Interface -----------------------------------*/

  getFormFieldParameters(caseObject?: string, subObject1?: string): any {
    return this.formsConfigurationService.getFormParameters(caseObject, 'fields', subObject1);
  }

  getFormFieldOptionDataByValue(caseObject?: string, subObject1?: string, subObject2?: string, subObject2Parameter?: string) {
    return this.formsConfigurationService.getFormParameterLabelByValue(caseObject, 'fields', subObject1, subObject2, subObject2Parameter);
  }

  getFormFilterOptionDataByValue(caseObject?: string, subObject1?: string, subObject2?: string, subObject2Parameter?: string) {
    return this.formsConfigurationService.getFormParameterLabelByValue(caseObject, 'filter_fields', subObject1, subObject2, subObject2Parameter);
  }

  getFormFilterParameters(caseObject?: string) {
    return this.formsConfigurationService.getFormParameters(caseObject, 'filter_fields')['filter'];
  }

  getFormActionParameters(caseObject?: string, buttonAction?: string) {
    return this.formsConfigurationService.getFormParameters(caseObject, 'actions', buttonAction);
  }

  getFormActionParameterDataByValue(caseObject?: string, subObject1?: string, subObject2?: string, subObject2Parameter?: string) {
    return this.formsConfigurationService.getFormParameterLabelByValue(caseObject, 'actions', subObject1, subObject2, subObject2Parameter);
  }

  getHelpTextsForCaseObjects() {
    return this.formsConfigurationService.getHelpGroupsForCaseObjects();
  }

  saveHelpText(helpText, caseObjectType, fieldName) {
    return this.formsConfigurationService.saveHelpText(helpText, caseObjectType, fieldName);
  }

  /* ------------------------------------ User Service Interface -----------------------------------*/

  getUserProfile(): any {
    return this.userProfileService.getUserProfileData();
  }

  hasUserSpecifiedRole(role: UserRole): boolean {
    return this.userProfileService.hasUserSpecifiedRole(role);
  }

  setUserProfile(res) {
    return this.userProfileService.setUserProfile(res);
  }

  logoutUser() {
    return this.userProfileService.logoutUser();
  }

  getStates() {
    return this.userProfileService1.getStatesData();
  }

  /* ------------------------------------ Preferred Roles Service Interface -----------------------------------*/

  getPreferredRoles() {
    return this.preferredRolesService.getPreferredRolesData();
  }

  getPreferredRolesByUserIDs(userIDs: string[]) {
    return this.preferredRolesService.getPreferredRolesByUserIDs(userIDs);
  }

  updatePreferredRoles(roles: string[]) {
    return this.preferredRolesService.updatePreferredRoles(roles);
  }

  getRolesDetails() {
    return this.preferredRolesService.getRolesDetails();
  }

}
