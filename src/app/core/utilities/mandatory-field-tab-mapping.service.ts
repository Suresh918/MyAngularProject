import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandatoryFieldTabMappingService {
  changeRequestMandatoryFields: any;
  changeNoticeMandatoryFields: any;

  constructor() {
    this.changeRequestMandatoryFields = {
      'changeSpecialist1': 0,
      'changeSpecialist2': 0,
      'generalInformation.createdBy': 0,
      'generalInformation.title': 0,
      'ID': 0,
      'impactAnalysis.customerImpactAnalysis.customerImpact': 2,
      'impactAnalysis.preInstallImpactAnalysis.preInstallImpact': 2,
      'implementationRanges': 2,
      'problemDescription': 0,
      'projectID': 0,
      'secure': 0
    };
    this.changeNoticeMandatoryFields = {
      'changeSpecialist2': 0,
      'customerImpact': 0,
      'generalInformation.createdOn': 0,
      'generalInformation.title': 0,
      'ID': 0,
      'implementationRanges': 0,
      'projectID': 0,
      'revisionStatus': 0,
      'secure': 0
    };
  }

  getTabIndex(fieldId: string, type: string) {
    if (type === 'ChangeRequest') {
      return this.changeRequestMandatoryFields[fieldId];
    } else if (type === 'ChangeNotice') {
      return this.changeNoticeMandatoryFields[fieldId];
    }
    return '';
  }
}
