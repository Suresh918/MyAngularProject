import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {AuditLogService} from '../../../core/services/audit-log.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ReleasePackageDetailsService} from '../../../release-package/release-package-details/release-package-details.service';

@Component({
  selector: 'mc-history-quick-card',
  templateUrl: './history-quick-card.component.html',
  styleUrls: ['./history-quick-card.component.scss'],
  providers: [ChangeRequestService, ReleasePackageDetailsService]
})
export class HistoryQuickCardComponent implements OnInit {
  @Input()
  caseObjectId: string;
  @Input()
  caseObjectType: string;
  @Input()
  secondaryCaseObjectType: string;
  @Input()
  releasePackageNumber: string;
  @Input()
  caseObjectIdMyTeam: string;
  historyItems: any[];
  showLoader = false;
  @ViewChild('historyMenu') historyMenu;
  totalHistoryItems: number;
  emptyStateData;

  constructor(private readonly router: Router,
              private readonly auditLogService: AuditLogService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly configurationService: ConfigurationService,
              private readonly releasePackageService: ReleasePackageDetailsService) {
  }

  ngOnInit() {
    this.historyItems = [];
    this.emptyStateData = {
      title: 'No Status Changes',
      subTitle: 'Status changes will appear here',
      description: 'A history of all changes can be found below. This includes other changes than status',
      icon: 'history'
    };
  }

  getCaseObjectHistory() {
    this.showLoader = true;
    if (this.caseObjectType === 'review') {
      this.auditLogService.getReviewHistory(this.caseObjectId, 'status').subscribe(res => {
        if (res) {
          this.totalHistoryItems = res['entries'].length;
          this.historyItems = res['entries'] ? res['entries'] : [];
          this.historyItems.forEach(item => {
            item.statusLabel = this.configurationService.getFormFieldOptionDataByValue('Review2.0', 'status', JSON.stringify(item.value));
          });
        }
        this.showLoader = false;
      });
    } else if (this.caseObjectType === 'myTeam') {
      let caseObjectType = '';
      switch (this.secondaryCaseObjectType) {
        case 'change-requests': caseObjectType = 'ChangeRequest'; break;
        case 'change-notices': caseObjectType = 'ChangeNotice'; break;
        case 'release-packages': caseObjectType = 'ReleasePackage'; break;
        default: break;
      }
      this.auditLogService.getMyTeamHistory(((caseObjectType !== 'ChangeNotice') ? this.caseObjectIdMyTeam : this.caseObjectId), caseObjectType).subscribe(res => {
        if (res) {
          if ( caseObjectType === 'ChangeNotice') {
            this.totalHistoryItems = res['allHistoryCount'] || 0;
            this.historyItems = res['MyTeamHistory'] && res['MyTeamHistory']['myTeamHistoryDetails'] ? res['MyTeamHistory']['myTeamHistoryDetails'] : [];
          } else {
            this.historyItemList(res);
          }
        }
        this.showLoader = false;
      });
    } else if (this.caseObjectType === 'ChangeRequest') {
      this.changeRequestService.getCRHisotry(this.caseObjectId, 'status').subscribe(res => {
        if (res) {
          this.totalHistoryItems = res['entries'].length;
          this.historyItems = res['entries'] ? res['entries'] : [];
          this.historyItems.forEach(item => {
            item.statusLabel = this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0', 'status', JSON.stringify(item.value), 'label');
          });
        }
        this.showLoader = false;
      });
    } else if (this.caseObjectType === 'ReleasePackage') {
      this.releasePackageService.getRPHistory(this.caseObjectId, 'status').subscribe(res => {
        if (res) {
          this.totalHistoryItems = res['entries'].length;
          this.historyItems = res['entries'] ? res['entries'] : [];
          this.historyItems.forEach(item => {
            item.statusLabel = this.configurationService.getFormFieldOptionDataByValue('ReleasePackage2.0', 'status', JSON.stringify(item.value), 'label');
          });
        }
        this.showLoader = false;
      });
    } else {
      this.auditLogService.getCaseObjectHistory(this.caseObjectId, this.caseObjectType).subscribe(res => {
        if (res) {
          this.totalHistoryItems = res['allHistoryCount'] || 0;
          this.historyItems = res['StatusHistory'] && res['StatusHistory']['statusHistoryDetails'] ? res['StatusHistory']['statusHistoryDetails'] : [];
          const caseObjectType = 'action' ? 'Action' : this.caseObjectType;
          this.historyItems.forEach(item => {
            item.statusLabel = this.configurationService.getFormFieldOptionDataByValue(caseObjectType, 'generalInformation.status', item.status, 'label');
          });
        }
        this.showLoader = false;
      });
    }
  }

  historyItemList(results) {
    const totalListHistoryItems = [];
    // Consider those records which are having revision_type DEL OR property user
    if (results && results.my_team && results.my_team.entries && results.my_team.entries.length > 0) {
      results.my_team.entries.forEach((data) => {
        if (data.revision_type === 'DEL' || data.property === 'user') {
          totalListHistoryItems.push(data);
        }
      });
    }

    if (results && results.members && results.members.length > 0) {
      results.members.forEach((membersData) => {
        if (membersData.member && membersData.member.entries && membersData.member.entries.length > 0) {
          membersData.member.entries.forEach((data) => {
            if (data.revision_type === 'DEL' || data.property === 'user') {
              totalListHistoryItems.push(data);
            }
          });
        }
      });
    }

    this.totalHistoryItems = totalListHistoryItems.length;
    if (totalListHistoryItems.length > 0) {
      totalListHistoryItems.forEach(item => {
        item['modifiedBy'] = item.updater;
        item['modifiedOn'] = item.updated_on;
        item['userModified'] = (item.revision_type === 'DEL') ? item.old_value.user : item.value;
        item['action'] = (item.revision_type === 'ADD') ? 'Added By' : 'Removed By';
      });
    }
    this.historyItems = totalListHistoryItems.sort((a, b) => {
      return this.compare(a.modifiedOn, b.modifiedOn, false);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showAllHistory(): void {
    if (this.caseObjectType === 'myTeam') {
      this.router.navigate([`my-team/${this.secondaryCaseObjectType}/${this.caseObjectId}/history/${this.caseObjectIdMyTeam}`]);
    } else if (this.caseObjectType === 'ReleasePackage') {
      this.router.navigate([`audit/audit-log/${this.caseObjectType.toUpperCase()}/${this.releasePackageNumber}`]);
    } else {
      this.router.navigate([`audit/audit-log/${this.caseObjectType.toUpperCase()}/${this.caseObjectId}`]);
    }
  }
}
