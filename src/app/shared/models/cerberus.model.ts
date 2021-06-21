export interface DIABOM {
  ID?: string;
  id?: string;
  lastModifiedBy?: User;
  lastModifiedOn?: Date;
  changeRequestID?: string;
  changeNoticeID?: string;
  revisions?: DIABOMRevision[];
}

export interface DIA {
  id: number;
  last_modified_by?: User2;
  last_modified_on?: string;
  changeRequestID?: number;
  changeNoticeID?: number;
  revisions?: DIARevision[];
}

interface User {
  fullName: string;
  employeeNumber: string;
}

interface User2 {
  full_name: string;
  employee_number: number;
}

export interface DIABOMRevision {
  ID: string;
  revision: string;
  lastModifiedBy?: User;
  lastModifiedOn?: Date;
}

export interface DIARevision {
  id: number;
  changeRequestID?: number;
  changeNoticeID?: number;
  last_modified_by?: User2;
  last_modified_on?: string;
  revision?: string;
}
