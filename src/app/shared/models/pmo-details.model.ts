import {User, MiraiUser} from "./mc.model";

export interface PMODetails {
  project_id?: string;
  description?: string;
  definition?: string;
  project_lead?: MiraiUser;
  project_cluster_manager?: MiraiUser;
  product_development_manager?: MiraiUser;
}
