export interface ChangeRequestList {
  totalItems: number;
  changeRequestSummaries: ChangeRequestSummary[];
}
export interface ChangeRequestSummary {
  ID: string;
  title: string;
  status: string;
  totalCompletedActions: number;
  totalActions: number;
  linkedToCN: boolean;
}
