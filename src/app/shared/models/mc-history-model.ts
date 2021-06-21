import {Permission, User} from './mc.model';
import {WorkBreakdownStructure} from './work-breakdown-structure.model';
import {Project} from './project.model';
import {FormControlEnumeration} from './mc-configuration.model';
import {Problem} from './air.model';
import {ProductBreakdownStructure} from './product-breakdown-structure.model';


export class HistoryModel {
  productID?: Project[];
  projectID?: WorkBreakdownStructure[];
  PCCSTRAIMIDs?: Problem[];
  PBSIDs?: ProductBreakdownStructure[];
  role?: FormControlEnumeration[];
  user?: User[];
  group?: Permission[];

  constructor(historyModel: HistoryModel) {
    historyModel = historyModel || {} as HistoryModel;
    historyModel.productID = historyModel.productID ? historyModel.productID : [];
    historyModel.projectID = historyModel.projectID ? historyModel.projectID : [];
    historyModel.PCCSTRAIMIDs = historyModel.PCCSTRAIMIDs ? historyModel.PCCSTRAIMIDs : [];
    historyModel.PBSIDs = historyModel.PBSIDs ? historyModel.PBSIDs : [];
    historyModel.user = historyModel.user ? historyModel.user : [];
    historyModel.role = historyModel.role ? historyModel.role : [];
    historyModel.group = historyModel.group ? historyModel.group : [];
    return historyModel;
  }
}

export class ActionHistoryModel {
  type?: FormControlEnumeration[];
  assignee?: User[];
  constructor(actionHistoryModel: ActionHistoryModel) {
    actionHistoryModel = actionHistoryModel || {} as ActionHistoryModel;
    actionHistoryModel.type = actionHistoryModel.type ? actionHistoryModel.type : [];
    actionHistoryModel.assignee = actionHistoryModel.assignee ? actionHistoryModel.assignee : [];
    return actionHistoryModel;
  }
}




