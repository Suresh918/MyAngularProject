import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {DIA, DIABOM} from '../../models/cerberus.model';
import {CerberusService} from '../../../core/services/cerberus.service';
import {CaseObjectOverview} from '../case-object-list/case-object-list.model';
import {CaseObjectRouterPath, CaseObjectServicePath} from '../case-object-list/case-object.enum';
import {CaseObject, User} from '../../models/mc.model';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {FilterOptions, People} from '../../models/mc-filters.model';
import {Subject, Subscription} from 'rxjs';
import {filterOptionsUpdate, selectShowFullMenu} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {select, Store} from '@ngrx/store';
import {MyChangeState, NavBarState, SidePanelState} from '../../models/mc-store.model';
import {selectNavBarState} from '../../../side-panel/store';

@Component({
  selector: 'mc-case-object-details-header',
  templateUrl: './case-object-details-header.component.html',
  styleUrls: ['./case-object-details-header.component.scss']
})
export class CaseObjectDetailsHeaderComponent implements OnInit {
  @Input()
  caseObjectType: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  caseObject: CaseObjectOverview;
  @Input()
  topic?: string;
  @Input()
  showItemDeleteButton: boolean;
  @Input()
  deleteButtonCaseAction: string;
  @Input()
  caseObjectFrom: string;
  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly selectedItem: EventEmitter<any> = new EventEmitter<any>();
  $navBarSubscriber: Subscription;
  showMenuSubscription$: Subscription;
  deepLinkTeamcenterURL: string;
  deepLinkChangeRequestDIAURL: string;
  deepLinkChangeNoticeDIAURL: string;
  delta2URL: string;
  diabom: DIA | DIABOM;
  progressBar: boolean;
  actionOverViewList: any[];
  isRightSidePanelOpened: boolean;
  isFullMenuVisible: boolean;

  constructor(
    private readonly router: Router,
    public readonly cerberusService: CerberusService,
    public readonly userProfile: UserProfileService,
    public readonly helpersService: HelpersService,
    public readonly configurationService: ConfigurationService,
    public readonly caseObjectListService: CaseObjectListService,
    public readonly appStore: Store<MyChangeState>,
    private readonly sidePanelStore: Store<SidePanelState>) {
    this.progressBar = false;
  }

  ngOnInit() {
    this.deepLinkTeamcenterURL = this.configurationService.getLinkUrl('Teamcenter');
    this.deepLinkChangeRequestDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CR');
    this.deepLinkChangeNoticeDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CN');
    this.registerShowMenuSubscriber();
    this.registerNavBarObservable();
  }

  naviagateToDetails(caseObject) {
    if (this.caseObjectType) {
      const routerPath = CaseObjectRouterPath[this.caseObjectType];
      this.caseObjectType === 'ReleasePackage' ? window.open(`/${routerPath}/${caseObject.release_package_number}`, '_blank') : window.open(`/${routerPath}/${caseObject.ID || caseObject.id}`, '_blank');
    }
  }

  openImplementationStrategy(): void {
    window.open('/change-requests/cr-implementation-strategy/' + this.caseObject['id'], '_blank');
  }

  openECN(): void {
    const ecnID = this.caseObject.team_center_id;
    window.open(this.deepLinkTeamcenterURL + (ecnID || ''), '_blank');
  }

  openDelta(): void {
    this.delta2URL = this.configurationService.getLinkUrl('Delta-2');
    const delta2 = this.delta2URL.replace('{RELEASE-PACKAGE-ID}', this.caseObject.release_package_number).replace('{SOURCE-SYSTEM-ALIAS-ID}', this.caseObject.ecn_number);
    window.open(delta2, '_blank', '', false);
  }

  getDIABOM(): void {
    switch (this.caseObjectType) {
      case 'ChangeRequest': {
        this.cerberusService.getDIABOMDetails((this.caseObject.ID || this.caseObject.id), CaseObjectServicePath[this.caseObject.type]).subscribe((res) => {
          this.diabom = res;
        });
        break;
      }
      case 'ChangeNotice': {
        this.cerberusService.getChangeNoticeDIABOM(this.caseObject.ID).subscribe((res) => {
          this.diabom = res;
        });
        break;
      }
      case 'ReleasePackage': {
        this.cerberusService.getDIABOMDetails((this.caseObject.ID || this.caseObject.id), CaseObjectServicePath[this.caseObjectType]).subscribe((res) => {
          this.diabom = res;
        });
        break;
      }
    }
  }

  openDIABOM(dia): void {
    let deepLinkDIAURL = '';
    let caseObjectID: string = this.caseObject.ID;
    switch (this.caseObjectType) {
      case 'ChangeRequest': {
        deepLinkDIAURL = this.deepLinkChangeRequestDIAURL;
        break;
      }
      case 'ChangeNotice': {
        deepLinkDIAURL = this.deepLinkChangeNoticeDIAURL;
        break;
      }
      case 'ReleasePackage': {
        deepLinkDIAURL = this.deepLinkChangeNoticeDIAURL;
        caseObjectID = this.caseObject.changeNoticeID;
        break;
      }
    }
    if (dia.revision === 'Working') {
      window.open(`${deepLinkDIAURL}${caseObjectID}`, '_blank', '', false);
    } else {
      window.open(`${deepLinkDIAURL}${caseObjectID}&revId=${dia.revision}`, '_blank', '', false);
    }
  }

  onDeleteItem(): void {
    this.deleteItem.emit(this.caseObject.ID || this.caseObject['id']);
  }

  getCaseObjectData(): CaseObject {
    return new CaseObject(this.caseObject.ID, '', this.caseObjectType);
  }

  onCaseObjectItemSelect($event, caseObject, event?): void {
//    event.stopPropagation();
    caseObject['checked'] = $event.checked;
    this.selectedItem.emit({'caseObjectID': caseObject.ID || caseObject.id, 'caseObjectType': this.caseObjectType, 'checked': caseObject.checked});
  }

  getCaseObjectActions(caseObject) {
    this.progressBar = true;
    this.actionOverViewList = [];
    const filter = 'generalInformation.status in ("OPEN","ACCEPTED")';
    this.caseObjectListService.getCaseObjectActionSummaries$( this.caseObjectType === 'ReleasePackage' ? caseObject.release_package_number : (caseObject.ID || caseObject.id), 'AA', this.caseObjectType, filter, '').subscribe((res) => {
      this.progressBar = false;
        this.actionOverViewList = res;
    });
  }

  navigateToActions(action) {
    event.stopPropagation();
    this.router.navigate([]).then(() => {
      window.open('actions/' + action.ID, '_blank');
    });
  }

  showAllAction() {
    const filters = this.userProfile.getCaseObjectStateFilters('action');
    if (filters && filters['filtersModel'] && filters['filtersModel']['currentDefaultFilter']) {
      filters['filtersModel']['currentDefaultFilter'] = new FilterOptions({});
      filters['filtersModel']['currentDefaultFilter'].linkedChangeObject = this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject;
      filters['filtersModel']['currentDefaultFilter'].fromCaseObject = this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject;
      filters['filtersModel']['currentDefaultFilter'].linkedItems = this.caseObject.id || this.caseObject.ID;
      const userProfileUpdatedState$: Subject<void> = new Subject();
      this.userProfile.updateCaseObjectStateFilters('action', filters, userProfileUpdatedState$);
      userProfileUpdatedState$.subscribe(() => {
        this.appStore.dispatch(filterOptionsUpdate(true));
        this.router.navigate(['/actions']);
      });
    }
  }

  registerShowMenuSubscriber() {
    this.showMenuSubscription$ = this.appStore.pipe(select(selectShowFullMenu)).subscribe((res: boolean) => {
      this.isFullMenuVisible = (res && res.valueOf());
    });
  }

  registerNavBarObservable() {
    this.$navBarSubscriber = this.sidePanelStore.pipe(select(selectNavBarState)).subscribe((res: NavBarState) => {
      this.isRightSidePanelOpened = (res && (res.rightNavBarState && res.rightNavBarState.isOpen && res.rightNavBarState.isOpen.valueOf()));
    });
  }
}
