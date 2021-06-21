import {Injectable} from '@angular/core';
import {ActionMetadata} from '../../shared/models/mc-presentation.model';
import {Action} from '../../shared/models/mc.model';
import {ActionType} from '../../shared/models/mc-enums';
import {ConfigurationService} from '../services/configurations/configuration.service';


@Injectable({
  'providedIn': 'root'
})
export class ActionHelpersService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  isUserIsAOwner(action: Action): boolean {
    return action.assignee ? action.assignee.userID === this.configurationService.getUserProfile().user_id : false;
  }

  isUserIsACreator(action: Action): boolean {
    return (action.generalInformation && action.generalInformation.createdBy)
      ? action.generalInformation.createdBy.userID === this.configurationService.getUserProfile().user_id : false;
  }

  showCaseActions(action: Action, isUserIsAOwner: boolean): boolean {
    return isUserIsAOwner && (action.type !== ActionType.ProcessReview) && (action.generalInformation.status === 'OPEN');
  }

  showRemoveButton(action: Action, isUserIsACreator: boolean): boolean {
    return isUserIsACreator && (action.type !== ActionType.ProcessReview) && (action.generalInformation.status === 'DRAFT'
      || action.generalInformation.status === 'OPEN'
      || action.generalInformation.status === 'ACCEPTED');
  }

  showCompleteButton(action: Action, isUserIsAOwner: boolean): boolean {
    return isUserIsAOwner
      && (action.generalInformation.status === 'OPEN'
        || action.generalInformation.status === 'ACCEPTED') && (action.type !== ActionType.ProcessReview);
  }

  getIconStatus(action: Action): string {
    const oDeadline = new Date(action.deadline);
    const currentDate = new Date();
    const timeDiff = oDeadline.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let iconStatus;
    if (diffDays >= 0 && diffDays < 3 && (action.generalInformation.state !== 'INACTIVE')) {
      iconStatus = 'WARNING';
    } else if (diffDays < 0 && (action.generalInformation.state !== 'INACTIVE')) {
      iconStatus = 'PROBLEM';
    } else if (action.generalInformation.status === 'DRAFT' || action.generalInformation.status === 'OPEN') {
      iconStatus = 'NEW';
    } else if (action.generalInformation.status === 'ACCEPTED') {
      iconStatus = 'ACCEPTED';
    } else if (action.generalInformation.status === 'COMPLETED') {
      iconStatus = 'CLOSED';
    } else if (action.generalInformation.status === 'REJECTED') {
      iconStatus = 'REJECTED';
    } else if (action.generalInformation.status === 'REMOVED') {
      iconStatus = 'REMOVED';
    }
    return iconStatus;
  }

  getActionMetadata(action: Action): ActionMetadata {
    const actionMetadata: ActionMetadata = {};
    actionMetadata.isUserIsAOwner = this.isUserIsAOwner(action);
    actionMetadata.isUserIsACreator = this.isUserIsACreator(action);
    actionMetadata.showCaseActionsSection = this.showCaseActions(action, actionMetadata.isUserIsAOwner);
    actionMetadata.showRemoveBtn = this.showRemoveButton(action, actionMetadata.isUserIsACreator);
    actionMetadata.showCompleteBtn = this.showCompleteButton(action, actionMetadata.isUserIsAOwner);
    actionMetadata.iconStatus = this.getIconStatus(action);
    actionMetadata.showNotesSection = false;
    return actionMetadata;
  }
}
