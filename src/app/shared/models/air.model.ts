import {User, MiraiUser} from './mc.model';

export interface Problem {
  number?: string;
  context_id?: string;
  name?: string;
  short_description?: string;
  owner?: MiraiUser;
  description?: string;
  solution_description?: string;
  initiator?: MiraiUser;
  solver?: MiraiUser;
  productID?: string;
  projectID?: string;
  functionalClusterID?: string;
  machine_type?: string;
  issue_type?: string;
  root_cause?: string;
  priority?: string;
  type?: string;
  errorInServiceCall?: string;
  itemType?: string;
}

export interface RootCause {
  parentNumber?: string;
  shortDescription?: string;
  description?: string;
  status?: string;
}
