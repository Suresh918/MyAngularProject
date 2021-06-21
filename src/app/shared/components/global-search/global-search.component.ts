import {AfterContentInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

import {McStatesModel} from '../../models/mc-states-model';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {CerberusService} from '../../../core/services/cerberus.service';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";
import {DIA, DIABOM} from '../../models/cerberus.model';
import {CaseObjectServicePath} from '../case-object-list/case-object.enum';
import {combineLatest, forkJoin} from "rxjs";
import {Categories} from "../../models/mc-presentation.model";
import {backgroundTaskDetailsUpdated} from "../../../store";
const GLOBAL_SEARCH_MAX_LENGTH = 6;
@Component({
  selector: 'mc-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})

export class GlobalSearchComponent implements OnInit, AfterContentInit {
  showGlobalSearch: boolean;
  searchControl = new FormControl();
  showLoader: boolean;
  filteredOptions: string[];
  mcState: McStatesModel;
  showChips: boolean;
  chipList = [
    {name: 'CR', type: 'changerequest'},
    {name: 'CN', type: 'changenotice'},
    {name: 'RP', type: 'releasepackage'},
  ];
  selectedChips: string;
  listStartIndex: number;
  listSize: number;
  totalResults: any;
  searchString: string;
  caseObjectList: any[];
  deepLinkTeamcenterURL: string;
  deepLinkChangeRequestDIAURL: string;
  deepLinkChangeNoticeDIAURL: string;
  delta2URL: string;
  dia: DIA;
  diabom: DIABOM;
  caseObjectID: string;
  caseObjectType: string;
  private _pageScrolled: boolean;
  searchPlaceholder: ElementRef;

  @ViewChild('searchPlaceholder') set content(content: ElementRef) {
    this.searchPlaceholder = content;
  }

  constructor(private readonly userProfileService: UserProfileService,
              private readonly router: Router,
              private readonly helpersService: HelpersService,
              private readonly caseObjectListService: CaseObjectListService,
              private readonly cerberusService: CerberusService,
              public readonly configurationService: ConfigurationService) {
    this.listStartIndex = 0;
    this.listSize = 8;
    this.caseObjectList = [];
    this.totalResults = {};
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.showGlobalSearch = false;
    this.selectedChips = '';
  }

  ngOnInit() {
    this.selectedChips = '';
    this.showGlobalSearch = false;
    this.searchControl.setValue('');
    this.deepLinkTeamcenterURL = this.configurationService.getLinkUrl('Teamcenter');
    this.deepLinkChangeRequestDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CR');
    this.deepLinkChangeNoticeDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CN');
    this.delta2URL = this.configurationService.getLinkUrl('Delta-2');
  }

  openGlobalSearch() {
    this.clearSearch();
    this.listStartIndex = 0;
    this.showChips = false;
    this.mcState = this.userProfileService.getStatesData();
    this.filteredOptions = [...this.mcState.commonState.commonSearchState.globalSearchHistory].reverse();
    this.showGlobalSearch = !this.showGlobalSearch;
    setTimeout(() => {
      this.searchPlaceholder.nativeElement.focus();
    });
  }

  ngAfterContentInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500))
      .subscribe(res => {
        this.listStartIndex = 0;
        if (res !== '') {
          this.searchString = res;
          this.showChips = true;
          this.getSelectedCaseObjectList();
        } else {
          this.showChips = false;
        }
      });
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  getSelectedCaseObjectList(): void {
    /**
     * Digital data track
     * */
    window['digitalData'].events.push({eventName: 'globalSearch', eventText: this.searchString});
    this.showLoader = true;
    this.caseObjectList = this._pageScrolled ? this.caseObjectList : [];
    const servicesList = this.getGlobalSearchList(this.selectedChips, this.listStartIndex, this.listSize, this.searchString);
    combineLatest(servicesList).subscribe((resListArray: any[]) => {
      this.showLoader = false;
      if (resListArray && resListArray.length > 0) {
        let totalCount = 0;
        Object.keys(this.totalResults).forEach(resultItem => this.totalResults[resultItem] = 0);
        const chipsArray = (this.selectedChips !== '') ? this.selectedChips.split(',') : ['changerequest', 'changenotice', 'releasepackage'];
        this.listStartIndex = this.listSize + this.listStartIndex;
        resListArray.forEach((resList, index) => {
          if (chipsArray.length > 0) {
            this.totalResults[chipsArray[index]] = resList.total_elements || 0;
          }
          if (resList && resList.results) {
            totalCount += resList.total_elements;
            this.caseObjectList = this.caseObjectList.concat(resList.results);
          }
        });
        this._pageScrolled = false;
        this.filteredOptions = this.caseObjectList;
        this.totalResults['totalItems'] = totalCount;
      }
    });
  }

  getGlobalSearchList(selectedCaseObjects, listStartIndex, listSize, searchString) {
    const serviceList = [];
    if (selectedCaseObjects.indexOf('changerequest') > -1) {
      serviceList.push(this.caseObjectListService.getCRGlobalSearchResults$(listStartIndex, listSize, searchString));
    } if (selectedCaseObjects.indexOf('changenotice') > -1) {
      serviceList.push(this.caseObjectListService.getGlobalSearchResults$(listStartIndex, listSize, searchString));
    } if (selectedCaseObjects.indexOf('releasepackage') > -1) {
      serviceList.push(this.caseObjectListService.getRPGlobalSearchResults$(listStartIndex, listSize, searchString));
    } if (selectedCaseObjects === '') {
      serviceList.push(this.caseObjectListService.getCRGlobalSearchResults$(listStartIndex, listSize, searchString));
      serviceList.push(this.caseObjectListService.getGlobalSearchResults$(listStartIndex, listSize, searchString));
      serviceList.push(this.caseObjectListService.getRPGlobalSearchResults$(listStartIndex, listSize, searchString));
    }
    return serviceList;
  }

  showSearchResults(option: any) {
    const stateHistory = this.mcState.commonState.commonSearchState.globalSearchHistory;
    if (typeof option === 'object') {
      if (stateHistory.indexOf(option.id) === -1) {
        if (stateHistory.length >= GLOBAL_SEARCH_MAX_LENGTH) {
          stateHistory.splice(0, (stateHistory.length - GLOBAL_SEARCH_MAX_LENGTH + 1));
        }
        stateHistory.push(option.release_package_number ? option.release_package_number : option.id);
      }
      this.userProfileService.updateUserProfileStates(this.mcState);
      this.router.navigate([`${this.helpersService.getCaseObjectForms(option.type).path}/${option.release_package_number ? option.release_package_number : option.id}`]);
      this.showGlobalSearch = false;
    } else {
      this.searchControl.setValue(option);
    }
  }


  toggleSearchResults(chip: any): void {
    const chipsArray = this.selectedChips.split(',');
    const index = chipsArray.indexOf(chip.type);
    if (index > -1) {
      chipsArray.splice(index, 1);
      this.selectedChips = chipsArray.join(',');
    } else {
      this.selectedChips = (this.selectedChips) ? (this.selectedChips + ',') + chip.type : chip.type;
    }
    this.isSelected(chip);
    this.listStartIndex = 0;
    this.getSelectedCaseObjectList();
  }

  isSelected(chip: any): boolean {
    const index = this.selectedChips.indexOf(chip.type);
    return index >= 0;
  }

  onScroll() {
    if (this.totalResults.totalItems > this.caseObjectList.length) {
      this._pageScrolled = true;
      this.getSelectedCaseObjectList();
    }
  }

  openImplementationStrategy(option): void {
    window.open('/change-requests/cr-implementation-strategy/' + option.id, '_blank');
  }

  openECN(option): void {
    const ecnID = option.teamcenter_id;
    window.open(this.deepLinkTeamcenterURL + (ecnID || ''), '_blank');
  }

  openDelta(option): void {
    this.delta2URL = this.configurationService.getLinkUrl('Delta-2');
    const delta2 = this.delta2URL.replace('{RELEASE-PACKAGE-ID}', option.release_package_number).replace('{SOURCE-SYSTEM-ALIAS-ID}', option.ecn_number);
    window.open(delta2, '_blank', '');
  }

  getDIABOM(option): void {
    switch (option.type) {
      case 'ChangeRequest': {
        this.cerberusService.getDIABOMDetails(option.id, CaseObjectServicePath[option.type])
          .subscribe((res) => {
            this.dia = res;
          });
        break;
      }
      case 'ChangeNotice': {
        this.cerberusService.getChangeNoticeDIABOM(option.id).subscribe((res) => {
          this.diabom = res;
        });
        break;
      }
      case 'ReleasePackage': {
        this.cerberusService.getDIABOMDetails(option.id, CaseObjectServicePath[option.type]).subscribe((res) => {
          this.dia = res;
        });
        break;
      }
    }
    this.caseObjectID = option.changeNoticeID ? option.changeNoticeID : option.type === 'ReleasePackage' ? option.release_package_number.split('-')[0] : option.id;
    this.caseObjectType = option.type;
  }

  openDIABOM(dia): void {
    let deepLinkDIAURL = '';
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
        break;
      }
    }
    if (dia.revision === 'Working') {
      window.open(`${deepLinkDIAURL}${this.caseObjectID}`, '_blank', '');
    } else {
      window.open(`${deepLinkDIAURL}${this.caseObjectID}&revId=${dia.revision}`, '_blank', '');
    }
  }

  showAllfilteredObjects(selectedChip) {
    this.router.navigate([`${this.helpersService.getCaseObjectForms(selectedChip).path}`]);
  }

  keyDownFunction(event) {
    if (this.filteredOptions && this.filteredOptions.length === 1) {
      this.showSearchResults(this.filteredOptions[0]);
    } else {
      if (this.selectedChips) {
        const selectedChipsArray = this.selectedChips.split(',');
        if (selectedChipsArray && selectedChipsArray.length === 1) {
          this.router.navigate([`${this.helpersService.getCaseObjectForms(selectedChipsArray[0].toUpperCase()).path}`]);
          this.showGlobalSearch = false;
        }
      }
    }
  }
}
