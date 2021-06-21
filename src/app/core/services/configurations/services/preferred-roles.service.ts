import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ActionSummaryList, PreferredRole} from '../../../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class PreferredRolesService {
  preferredRolesUrl: string;
  preferredRolesData: PreferredRole;
  ROLES_DETAILS: any = {
    'businessController': {
      'explanation': 'Formulate and execute financial policies and services to enable the business to run the business in a cost effective method. Organizes and performs auditing functions as required. Ensure proper integration in the business processes, administration and reporting.',
      'label': 'Business Controller',
      'placeholder': 'Enter Text',
      'ID': 'businessController'
    },
    'changeSpecialist1': {
      'explanation': 'The Change Specialist 1 manages the processing of Change Requests from their initiation to their final disposition. In the initiation phase the Change Specialist 1 is triggered to create a new Change Request by, for example, AIR issues, PBS items or ‘Customer Special Requests’. The Change Specialist 1 verifies a Development & Engineering Project Lead is appointed and that the required information is in place to start solution definition and impact analysis for the change. This results in impacted products/affected items, a concept design being made, costs and benefits, an implementation strategy and other required information for the change. A business case for the change is prepared by the Development & Engineering Project Lead (supported by a Change Specialist 2) and is consolidated by the Change Specialist 1. The Change Specialist 1 places the Change requests with a prepared business case on the agenda of the Change Board of the relevant business line(s), makes sure the Change Board members are prepared and aligned with the Cross Sector team, and chairs the Change Board meeting. For each Change Request a decision must be made supported by all Change Board members. The Change Specialist 1 role includes responsibility for minimizing the time between receipt of a request and its eventual approval or rejection. Finally, the Change Specialist 1 monitors progress of the Change request during the Change Notification phase in consultation with Change Specialist 2 and closes the Change Request when the change is implemented.',
      'label': 'Change Specialist 1',
      'abbreviation': 'CS1',
      'placeholder': 'Enter Text',
      'ID': 'changeSpecialist1'
    },
    'changeSpecialist2': {
      'explanation': 'Change Specialist 2 receives both on- and off-line approved Change Requests from the Change Board and prepares Change Notices for their implementation. Change Specialist 2 sorts approved Change Requests into like-groups on the basis of their impact matrix and implementation strategy. To increase efficiency, Change Requests which impact the same documents and which can share the same effectivity (i.e.. their planning can be aligned) should be implemented as one change. Change Specialist 2 groups approved Change Requests in a manner that best achieves end-item traceability, minimizes implementation costs (he/she is in the best position to verify that the appropriate re-identification decisions have been made) and increases the change implementation efficiency. Change Specialist 2 creates a new impact matrix once the Change Requests to be implemented with one Change Notice have been selected. Change Specialist 2 must also consider workloads prior to releasing an Change Notice.',
      'label': 'Change Specialist 2',
      'abbreviation': 'CS2',
      'placeholder': 'Enter Text',
      'ID': 'changeSpecialist2'
    },
    'changeSpecialist3': {
      'explanation': 'Change Specialist 3 audits Release Packages to assure continuity between superseded and superseding documents, records and data. Fast-track and full-track Change Notices and detailed change implementation plans are used as checklists of audit requirements.\nChange Specialist 3:\n- Verifies that each document is properly identified by type, number and revision level, as specified in the Change Notice road map;\n- Verifies that the revision history for each upgraded document is provided as shown in its revision record;\n- Verifies that each document has been validated by its assigned creator and one or more designated users; \n- Authorizes the release of documents and/or data and revision records which conform to the Change Notice requirements. \nOne option is to return any detected deficiency to the creator or user whose negligence or oversight resulted in that specific deficiency.',
      'label': 'Change Specialist 3',
      'abbreviation': 'CS3',
      'placeholder': 'Enter Text',
      'ID': 'changeSpecialist3'
    },
    'cmFieldRepresentative': {
      'explanation': 'Responsible role for representing Field in the Manage Configuration Change process.\n\nDepending Example product maturity and example geographic organization this role is covered by the following business function (Typically the function to fulfill the role is assigned when project is started): \n• CS HVM Engineering architect \n• CS EUV Competence engineer \n• CS Apps Engineer\n• D&E ‘Equipment Engineer’',
      'label': 'CM Field representative',
      'abbreviation': 'EE/CS, Tool EE',
      'placeholder': 'Enter Text',
      'ID': 'cmFieldRepresentative'
    },
    'cmLeadEngineerRepresentative': {
      'explanation': 'Responsible role for representing Development & Engineering Lead Engineer in the Manage Configuration Change process.\n\nDepending example product maturity, scope and complexity of the Change and example geographic organization this role is covered by the following business function: \n * DE Architect\n * DE Lead Engineer\n * DE Team Lead\n * DE Designer',
      'label': 'CM Lead Engineer representative',
      'abbreviation': 'D&E LE, TL, Packing coordinator, MDO',
      'placeholder': 'Enter Text',
      'ID': 'cmLeadEngineerRepresentative'
    },
    'cmManufacturingRepresentative': {
      'explanation': 'Responsible role for representing Manufacturing (Factory & Install) in the Manage Configuration Change process.\n\nDepending exa product maturity and BSNL geographic organization this role is covered by the following business function: \n<KD13 = Manufacturing Engineer and LAB Production Engineer\n>=KD13 = Production Engineer',
      'label': 'CM Manufacturing representative',
      'placeholder': 'Enter Text',
      'abbreviation': 'ME/PE, Tool ME',
      'ID': 'cmManufacturingRepresentative'
    },
    'coordinatorSCMPLM': {
      'explanation': 'Coordinates in cross-sectorial projects the optimization of the supply chain of products and materials during their Product Life-Cycle (introduction, ramp up and phase-out) while balancing timing, logistics related costs, quality and risks.\n\nSecures material availability to enable the BSNL technology roadmap.\n\nRepresents the supply chain in Cross Sector Team. Determines the logistic consequences of proposed plan changes and related actions on project and program level. \n\nSecures that logistic requirements are met in product design, supply chain developments and related quality performance. Plans and reports on the timely availability of TPD (Technical Product Documentation) & completeness of Bill of Material. \n\nSecures availability of accurate implementation plans for engineering changes and challenges the project on timing and supply chain impact. \n\nMonitors proper execution of this implementation plan. Plans, co-ordinates and administrates the material flow for critical, non-volume materials (parts, proto’s, spares, tools & packaging) in co-operation with Procurement, Material Planning and Service Logistics.',
      'label': 'Coordinator SCM PLM',
      'placeholder': 'Enter Text',
      'abbreviation': 'PLM PC',
      'ID': 'coordinatorSCMPLM'
    },
    'development&EngineeringArchitect': {
      'explanation': null,
      'abbreviation': 'D&E architect',
      'label': 'D&E Architect',
      'placeholder': 'Enter Text',
      'ID': 'development&EngineeringArchitect'
    },
    'development&EngineeringGroupLead': {
      'explanation': 'Hierarchical role (R+1) ultimately answerable for the correct and thorough completion of the activity performed by the Development & Engineering Project Lead in the Manage Configuration Change process.\nSecure that sector representatives are available to execute the change within required timeframe.',
      'abbreviation': 'Change board member',
      'label': 'Development & Engineering Group Lead',
      'placeholder': 'Enter Text',
      'ID': 'development&EngineeringGroupLead'
    },
    'development&EngineeringProjectLead': {
      'explanation': 'Lead a multidisciplinary cross sectoral team. Has execution & integration responsibility: leads the execution of the selected integrated solutions across sectors\nUnderstands proper escalation paths and acts accordingly\n* Allocates work and appoints owners to logical \'buckets\' of deliverables in line with team structure\n* Ensures deliverables are finalized on time and in budget - intervenes where needed',
      'abbreviation': 'D&E PL',
      'label': 'Development & Engineering Project Lead',
      'placeholder': 'Enter Text',
      'ID': 'development&EngineeringProjectLead'
    },
    'ecnExecutor': {
      'explanation': 'Responsible role for administering the TeamCenter ECN object. Depending BSNL product maturity and BSNL geographic organization this role is covered by the following business function:\n• Design Engineer\n• Manufacturing Engineer\n• Production Engineer',
      'label': 'ECN executor',
      'abbreviation': 'ECN executor, Design engineer',
      'placeholder': 'Enter Text',
      'ID': 'ecnExecutor'
    },
    'headOfCSGroup': {
      'explanation': 'Hierarchical role (R+1) ultimately answerable for the correct and thorough completion of the activity performed by the CM Field representative in the Manage Configuration Change process.\n\nSecure that sector representatives are available to execute the change within required timeframe.\n\nDepending BSNL product maturity and BSNL geographic organization this role is typically covered by the following CS staff functions:\n• CS NPI DUV PL\n• CS HVM Engineering department lead',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Head of CS Group',
      'ID': 'headOfCSGroup'
    },
    'headOfDETeam': {
      'explanation': 'Role responsible for the correct and thorough completion of the activity performed by the Development & Engineering representative(s) in the Manage Configuration Change process.',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Head of DE Team',
      'ID': 'headOfDETeam'
    },
    'headOfProductionOperation': {
      'explanation': 'Hierarchical role (R+1) ultimately answerable for the correct and thorough completion of the activity performed by the Manufacturing representative in the Manage Configuration Change process.\n\nSecure that sector representatives are available to execute the change within required timeframe.',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Head of Production Operation',
      'ID': 'headOfProductionOperation'
    },
    'headOfSystemIntegrationGroup': {
      'explanation': 'Hierarchical role (R+1) ultimately answerable for the correct and thorough completion of the activity performed by the System Integration representative in the Manage Configuration Change process.\n\nSecure that sector representatives are available to execute the change within required timeframe.',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Head of System Integration Group',
      'ID': 'headOfSystemIntegrationGroup'
    },
    'other': {
      'explanation': 'Select this role only when you do not fulfill a Role as defined in the CM Manage Configuration Changes process.',
      'placeholder': 'Enter Text',
      'abbreviation': 'OTH',
      'label': 'Other',
      'ID': 'other'
    },
    'productDevelopmentManager': {
      'explanation': 'Accountable for (sub-)system development',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Product Development Manager',
      'ID': 'productDevelopmentManager'
    },
    'productManager': {
      'explanation': null,
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Product Manager',
      'ID': 'productManager'
    },
    'productSystemEngineer': {
      'explanation': 'Responsible for System level performance of the Product',
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Product System Engineer',
      'ID': 'productSystemEngineer'
    },
    'scmPLMProjectManager': {
      'explanation': null,
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'SCM PLM Project Manager',
      'ID': 'scmPLMProjectManager'
    },
    'sourcingLead': {
      'explanation': 'Contributing and (partly) responsible in the creation and execution of the specific category strategies, managing supplier performance and risk control, negotiating supplier contracts, driving supplier development activities, being involved and, on sourcing level, in the lead on new product introductions.',
      'placeholder': 'Enter Text',
      'abbreviation': 'Former PAM',
      'label': 'Sourcing Lead',
      'ID': 'sourcingLead'
    },
    'sourcingPL': {
      'explanation': null,
      'abbreviation': 'Change board member',
      'placeholder': 'Enter Text',
      'label': 'Sourcing PL',
      'ID': 'sourcingPL'
    },
    'submitterRequestor': {
      'explanation': 'Submitter / Requestor of change object',
      'placeholder': 'Enter Text',
      'label': 'Submitter/Requestor',
      'ID': 'submitterRequestor'
    },
    'supplyChainEngineer': {
      'explanation': 'Responsible role for representing Supplier Quality in the Manage Configuration Change process. \n\nDepending BSNL product maturity and BSNL geographic organization this role is covered by the following business function: \n=<KD12 = WLT DE SCE, VHV DE Supply Chain Engineering, \n>KD12 = WLT OPS SCE, Quality Supplier Manager (QSM)',
      'placeholder': 'Enter Text',
      'abbreviation': 'SQE (former SCE)',
      'label': 'Supply Chain Engineer',
      'ID': 'supplyChainEngineer'
    },
    'user': {
      'explanation': 'Users who can work on change object derived from Problem Item or Solution Item',
      'label': 'User',
      'placeholder': 'Enter Text',
      'ID': 'user'
    },
    'creator': {
      'explanation': 'Creator of Problem Item or Solution Item',
      'label': 'Creator',
      'placeholder': 'Enter Text',
      'ID': 'creator'
    },
    'changeOwner': {
      'explanation': 'Change Owner of the change object will be derived from Problem Items or Solution Items in case of Creator Change Object. In Case of Project Change Object will be same as Project Lead.',
      'label': 'Change Owner',
      'placeholder': 'Enter Text',
      'ID': 'changeOwner'
    }
  };

  constructor(private readonly http: HttpClient) {
    this.preferredRolesUrl = `${environment.rootURL}user-service/preferred-roles`;
  }

  getPreferredRoles() {
    return this.http.get(`${this.preferredRolesUrl}`).pipe(map(res => {
      return ((res) ? res : {});
    }), catchError(() => {
      return of({});
    }));
  }

  savePreferredRolesData(preferredRolesData) {
    this.preferredRolesData = preferredRolesData;
  }

  getPreferredRolesData() {
    return this.preferredRolesData.preferred_roles ? this.preferredRolesData.preferred_roles : [];
  }

  updatePreferredRoles(roles: string[]) {
    const payload = {
      'preferred_roles': roles
    };
    return this.http.post(`${this.preferredRolesUrl}`, payload).pipe(map(res => {
      if (res) {
        this.preferredRolesData = res;
      }
      return (res && res['preferred_roles'] ? res['preferred_roles'] : []);
    }));
  }

  getPreferredRolesByUserIDs(userIDs: string[]) {
    const qParams = {
      'user-ids': userIDs.join(',')
    };
    return this.http.get(`${this.preferredRolesUrl}`, {params: qParams}).pipe(
      map(res => res ? res : {})
    );
  }

  getRolesDetails() {
    return this.ROLES_DETAILS;
  }

}
