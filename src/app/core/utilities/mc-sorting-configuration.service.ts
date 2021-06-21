import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class McSortingConfigurationService {

  constructor() {
  }

  getCaseObjectSortingConfiguration(caseObjectType): McSortingConfiguration {
    switch (caseObjectType) {
      case 'changeRequest':
        return {
          title: 'Sort CRs on',
          sortingHeaders: [
            { label: 'Action due date', id: 'action.deadline' },
            { label: 'Prio (of CR)', id: 'priority' },
            { label: 'Creation date (of CR)', id: 'createdOn' },
            { label: 'Status of CR (\'Draft\' first)', id: 'status' }]
        };
      case 'changeNotice':
        return {
          title: 'Sort CNs on',
          sortingHeaders: [
            { label: 'Action due date', id: 'action.deadline' },
            { label: 'Prio (of CN)', id: 'priority' },
            { label: 'Creation date (of CN)', id: 'createdOn' },
            { label: 'Status of CN (\'Draft\' first)', id: 'status' }]
        };
      case 'releasePackage':
        return {
          title: 'Sort RPs on',
          sortingHeaders: [
            { label: 'Planned Release Date', id: 'plannedReleaseDate' },
            { label: 'Planned Effective Date', id: 'plannedEffectiveDate' },
            { label: 'Action due date', id: 'action.deadline' },
            { label: 'Open actions', id: 'openActionsCount' },
            { label: 'Creation date', id: 'createdOn' },
            { label: 'Status (\'new\' first)', id: 'status' }]
        };
       case 'linkedItems':
         return {
          title: 'Sort RPs on',
          sortingHeaders: [
            { label: 'RP ID', id: 'release_package_number' },
            { label: 'PRD', id: 'planned_release_date' }]
        };
      case 'agenda':
        return {
          title: 'Sort Agendas on',
          sortingHeaders: [
            {label: 'Meeting Date', id: 'startDateTime'},
            {label: 'Created On', id: 'createdOn'}
          ]
        };
      case 'action':
        return {
          title: 'Sort Actions on',
          sortingHeaders: [
            {label: 'Due Date', id: 'deadline'},
            {label: 'Created On', id: 'createdOn'}
          ]
        };
      case 'reviewEntry':
        return {
          title: 'Sort Defects on',
          sortingHeaders: [
            {label: 'Sequence Number', id: 'sequence_number'},
            {label: 'Classification', id: 'classification'},
            {label: 'Solution Item', id: 'contexts.name'},
            {label: 'Status', id: 'status'}
          ]
        };
      case 'review':
        return {
          title: 'Sort Reviews on',
          sortingHeaders: [
            { label: 'Title', id: 'title' },
            { label: 'Due Date', id: 'completion_date' },
            { label: 'Status', id: 'status' }]
        };
      case 'scopeItem':
        return {
          title: 'Sort Scope Items on',
          sortingHeaders: [
            { label: 'Creator', id: 'creator' },
            { label: 'Release Package Number', id: 'release_package_number' }]
        };
    }
  }
}

export interface McSortingConfiguration {
  title: string;
  sortingHeaders: McSortingHeaderConfiguration[];
}

export interface McSortingHeaderConfiguration {
  label: string;
  id: string;
  sortDesc?: string;
  direction?: string;
}
