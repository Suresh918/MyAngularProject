import {ChangeNotice, ChangeRequest, Decision, Minutes, User} from './mc.model';

export interface AgendaItemSummary {
  ID?: string;
  title?: string;
  status?: string;
  purpose?: string;
  purposeDetails?: string;
  section?: string;
  category?: string;
  subCategory?: string;
  plannedDuration?: string;
  minutes?: Minutes;
  presenter: User;
  productDevManager: User;
  productClusterManager: User;
  agendaSequenceNumber?: number;
  applicableCBRules?: string[];
  topic?: string;
  topicStatus?: string;
  decision?: Decision;
  startDateTime?: Date;
  isAOB?: boolean;
}

export interface LinkedCaseObject {
  type?: string;
  data?: ChangeRequest | ChangeNotice;
}

export interface AgendaItemSection {
  section?: string;
  index?: number;
  AgendaItemSummaryElement?: AgendaItemSummary[];
}

export interface AgendaSummaryModel {
  TotalItems: number;
  agendaItemSections: AgendaItemSection[];
}

export interface AgendaSectionUpdateItem {
  section?: string;
  agendaSequenceNumber?: string;
  ID?: string;
}

export interface AgendaSummary {
  ID: string;
  title: string;
  status: string;
  calendarID: string;
  finishDate: Date;
  startDate: Date;
  createdBy: User;
  agendaItemCount?: number;
  plannedDuration?: string;
}
