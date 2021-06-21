import {MiraiUser} from './mc.model';

export interface ProductBreakdownStructure {
  id?: string;
  context_id?: string;
  name?: string;
  deliverable?: string;
  status?: string;
  type?: string[];
  is_linkable_to_change_request?: boolean;
  description?: string;
  owner?: MiraiUser;
  projectID?: string;
  productID?: string;
  functionalClusterID?: string;
  functionalClusterParentID?: string;
  changeRequestID?: string;
  pgpIP?: string;
  pgpIPs?: string[];
  selected?: boolean;
  changeRequestIDs?: string[];
  errorInServiceCall?: string;
  itemType?: string;
}
