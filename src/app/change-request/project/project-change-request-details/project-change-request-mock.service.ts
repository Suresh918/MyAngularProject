import { of } from 'rxjs';

export class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, categoryType: string) {
    return {
      'generalInformation': {
        'status': {
          'enumeration': [
            { name: 'DRAFT', label: 'Draft', sequence: '1' },
            { name: 'NEW', label: 'New', sequence: '2' },
            { name: 'SOLUTION-DEFINED', label: 'Solution Defined', sequence: '3' },
            { name: 'IMPACT-ANALYZED', label: 'Impact Analyzed', sequence: '4' },
            { name: 'APPROVED', label: 'Approved', sequence: '5' },
            { name: 'REJECTED', label: 'Rejected', sequence: '5' },
            { name: 'CLOSED', label: 'Closed', sequence: '99' },
          ],
          'placeholder': 'Status:',
          'validatorConfiguration': { maxLength: '50' }
        }
      }
    };
  }
  getServiceParameter(service: string, categoryType?: string, parameterVal?: string): any[] {
    return [{
      'label': null,
      'locale': null,
      'name': 'https://expample.com',
      'sequence': '1',
      'type': null
    }];

  }
  getQuestionsList(service: string, categoryType: string) {
    return [
      {
        'locale': 'EN',
        'name': 'Does the change introduce or modify:↵-TPD of parts↵-TPD of spare parts↵-TPD of tooling↵-procedures↵-software↵↵used for:↵-manufacturing (excluding tooling and procedures)↵-pre-install↵-install↵-service (including FCO\'s)↵-upgrades',
        'question': 'Does the change introduce or modify:↵-TPD of parts↵-TPD of spare parts↵-TPD of tooling↵-procedures↵-software↵↵used for:↵-manufacturing (excluding tooling and procedures)↵-pre-install↵-install↵-service (including FCO\'s)↵-upgrades',
        'sequence': '1',
        'tooltip': 'Also date changes should be taken',
        'type': 'QUESTION'
      }
    ];
  }
}

export class ChangeRequestServiceMock {
  getChangeRequestDetails$(id: number) {
    return of({
      'ID': '4681',
      'revision': 'AA',
      'revisionStatus': 'CURRENT',
      'generalInformation': {
        'title': 'AIM: OASIS [ʎ]   position drifts OOS at IBM. motivation aborted in tab Details',
        'state': 'DECIDE',
        'status': 'APPROVED',
        'createdBy': {
          'userID': 'q04test',
          'fullName': 'Q 04test',
          'email': 'q04test@bsnl.qas',
          'abbreviation': 'Q04T'
        }
      }
    });
  }

  getLinkedChangeNotice$(id: number) {
    return of({
      'totalItems': 1,
      'LinkedChangeNoticeSummariesElement': [
        {
          'ID': '1741',
          'title': 'New CR',
          'status': 'NEW',
          'totalCompletedActions': '0',
          'totalActions': '2',
          'createdBy': {
            'userID': 'q04test',
            'fullName': 'Q 04test',
            'email': 'q04test@bsnl.qas',
            'abbreviation': 'Q04T'
          }
        }
      ]
    });
  }

  singleProblems$() {
    return of([{
        'number': 'P10000',
        'shortDescription': 'RUVS init does not recover from " n between vacuum" state',
        'owner': {
          'userID': 'odonnelm',
          'fullName': 'Mike ODonnell',
          'email': 'mike.odonnell@poc.example.local',
          'abbreviation': 'MODO',
          'departmentName': 'ES EUV SD Program Mgt'
        },
        'description': 'current state was "in between vacuum"  and pressure was 700mBAR After driver init a MMDC error (LDLK1 Illegal ISOVLV_SoftStart Open cmd combined with other val)  is given. to solve we pumped down manualy by opening the soft start/main vac valve and at vacuum state cleared all errors\r\n\r\nlogbook entry:\r\n--> KRIJ/TEWI : Investigate Loadlock failure\r\n \r\n++ MMDC error active on LL, Driver is in Busy state\r\n \r\n Module      : LDLK\r\n Function    : RH_LDLK_MMDC\r\n Sub Function: RH_LL1_ERROR\r\n Error       : RH_LDLK1 ISOVLV_MAIN Sensor Indeterminate Position Fault\r\n \r\n++ try init Loadlock driver, this should clear all MMDC, terminate driver first\r\n++ drivers inits OK, but still MMDC error active !! This should never happen, create issue\r\n \r\n Module      : LDLK\r\n Function    : RH_LDLK_MMDC\r\n Sub Function: RH_LL1_ERROR\r\n Error       : RH_LDLK1 Illegal ISOVLV_SoftStart Open cmd combined with other val\r\n ve command(s)\r\n++ Cleared MMDC errors using RHdebug, NOK\r\n     \r\n Module      : LDLK\r\n Function    : RH_LDLK_MMDC\r\n Sub Function: RH_LL1_ERROR\r\n Error       : RH_LDLK1 ISOVLV_SoftStart cmd not issued. VAC Pump not running\r\n \r\n++ Cleared MMDC errors using RHdebug again \r\n Module      : LDLK\r\n Function    : RH_LDLK_MMDC\r\n Sub Function: RH_LL1_ERROR\r\n Error       : RH_LDLK1 Illegal ISOVLV_SoftStart Open cmd combined with other valve command(s\r\n )\r\n     \r\n++ Closed all valves using ADT\r\n++ start VAC soft start - OK\r\n++ start VAC main - OK\r\n++ MMDC error still there\r\n++ Cleared MMDC with RHdebug - OK\r\n \r\nCreate issues:\r\n + MMDC actieve while driver idle\r\n + Not possible to re-init when pressure is in between\r\n + Not possible to open valves when drives is base inited',
        'initiator': {
          'userID': 'odonnelm',
          'fullName': 'Mike ODonnell',
          'email': 'mike.odonnell@poc.example.local',
          'abbreviation': 'MODO',
          'departmentName': 'ES EUV SD Program Mgt'
        },
        'solver': {
          'userID': 'harrold',
          'fullName': 'Hilary Harrold',
          'email': 'hilary.harrold@bsnl.qas',
          'abbreviation': 'HHAR',
          'departmentName': 'WT DE US Mechatronics & Defectivity'
        },
        'priority': '2'
      }
    ]);
  }

  updatePreInstallImpact$(caseObjectId, type, assessmentAnswers, getImpactResult) {
    return of({
      'ID': '4681',
      'revision': 'AA',
      'revisionStatus': 'CURRENT',
      'generalInformation': {
        'title': 'AIM: OASIS [ʎ]   position drifts OOS at IBM. motivation aborted in tab Details',
        'state': 'DECIDE',
        'status': 'APPROVED',
        'createdBy': {
          'userID': 'q04test',
          'fullName': 'Q 04test',
          'email': 'q04test@example.qas',
          'abbreviation': 'Q04T'
        }
      }
    });
  }

  updateCustomerImpact$(caseObjectId, type, assessmentAnswers, getImpactResult) {
    return of({
      'ID': '4681',
      'revision': 'AA',
      'revisionStatus': 'CURRENT',
      'generalInformation': {
        'title': 'AIM: OASIS [ʎ]   position drifts OOS at IBM. motivation aborted in tab Details',
        'state': 'DECIDE',
        'status': 'APPROVED',
        'createdBy': {
          'userID': 'q04test',
          'fullName': 'Q 04test',
          'email': 'q04test@example.qas',
          'abbreviation': 'Q04T'
        }
      }
    });
  }
}

export class CerberusServiceMock {
  getChangeRequestDIABOM(id: number) {
    return of({});
  }
}

export class UserAuthorizationServiceMock {
  getAuthorizedCaseActions(id: string, revision: string, secure: any, type: string) {
    return of({
      'caseActions': [
        { 'name': 'OBSOLETE' },
        { 'name': 'DEFINE' },
        { 'name': 'SAVE' },
        {
          'name': 'DEFINE-SOLUTION',
          'mandatoryParameters': []
        },
        { 'name': 'CREATE-CN' },
        { 'name': 'UPSERT-SECURE' },
        { 'name': 'CREATE-AGENDAITEM' },
        { 'name': 'READ' },
        { 'name': 'CREATE-ACTION' },
        {
          'name': 'SUBMIT',
          'mandatoryParameters': []
        },
        {
          'name': 'ANALYZE-IMPACT',
          'mandatoryParameters': []
        }
      ]
    });
  }
}

export class PbsSearchServiceMock {
  getProductBreakDownStructureList$(id: string) {
    return of([ {
      'ID': '10000',
      'projectID': '2122-0002',
      'productID': '2122',
      'deliverable': 'Additional power dissipated by LPPS must be removed',
      'functionalClusterID': 'FC-109',
      'functionalClusterParentID': 'SF-99',
      'status': 'Accept',
      'pgpIP': '118299',
      'pgpIPs': [
        '118299'
      ],
      'changeRequestID': '5751',
      'changeRequestIDs': [
        '200102',
        '200124',
        '200205',
        '202142',
        '202379',
        '202610',
        '203713',
        '203755',
        '203831',
        '203867',
        '203868',
        '203870',
        '559236',
        '560520',
        '574002',
        '5751',
        '5782',
        '759540',
        '773022'
      ],
      'type': 'PBS',
      'isLinkableToChangeRequest': true
    }]);
  }
}
