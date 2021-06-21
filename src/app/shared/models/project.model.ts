import {User} from "./mc.model";

export interface Project {
  projectDefinition?: string;
  description: string;
  projectLead?: User;
  lead?: User;
  definition?: string; // wbselement
  project_id?: string;
  clusterManager?: User;
  wbs_id?: string;
}
