import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ReleasePackage} from '../../models/mc.model';
import {SharedService} from '../../../core/services/shared.service';
import {TeamCenterService} from '../../../core/services/team-center.service';
import {ErrorHandlerService} from '../../../core/services/error-handler.service';
import {SidePanelState} from '../../models/mc-store.model';
import {closeSideNavBars} from '../../../side-panel/store';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-object-link',
  styleUrls: ['./object-link.component.scss'],
  templateUrl: './object-link.component.html'
})
export class ObjectLinkComponent implements OnInit {
  @Input()
  key: any;
  @Input()
  keyClass: any;
  @Input()
  value: any;
  @Input()
  valueClass: any;
  @Input()
  color: string;
  @Input()
  delimiter: string;
  @Input()
  direction: string;
  @Input()
  releasePackageDetails: ReleasePackage;
  @Input()
  optionalValue: any;
  deepLinkURL: string;
  delta1URL: string;
  delta2URL: string;
  inlineProgressBar: boolean;
  delta1ReportErrorMessage = 'Delta1 report does not exist or you are not authorized to access it. Please contact Teamcenter support.';

  constructor(public readonly configurationService: ConfigurationService,
              private readonly teamCenterService: TeamCenterService,
              private readonly sharedService: SharedService,
              private readonly router: Router,
              private readonly errorHandlerService: ErrorHandlerService,
              private readonly sidePanelStore: Store<SidePanelState>) {
    this.direction = 'row';
    this.delimiter = ':';
    this.deepLinkURL = this.configurationService.getLinkUrl('Teamcenter');
    this.delta1URL = this.configurationService.getLinkUrl('Delta-1');
    this.delta2URL = this.configurationService.getLinkUrl('Delta-2');
  }

  ngOnInit() {
  }

  openLink(key: string, releasePackage: ReleasePackage) {
    switch (key) {
      case 'Release Package': {
        this.sidePanelStore.dispatch(closeSideNavBars());
        this.router.navigate(['/release-packages/', releasePackage.id]);
        break;
      }
      case 'Source': {
        window.open(this.deepLinkURL + releasePackage.sourceSystemID, '_blank', '', false);
        break;
      }
      case 'Report': {
        this.inlineProgressBar = true;
        this.getDelta1Report(releasePackage);
        break;
      }
      default:
        return;
    }
  }

  openDeltaURL(releasePackage: ReleasePackage): void {
    const delta2 = this.delta2URL.replace('{RELEASE-PACKAGE-ID}', JSON.stringify(releasePackage.id)).replace('{SOURCE-SYSTEM-ALIAS-ID}', releasePackage.sourceSystemAliasID);
    window.open(delta2, '_blank', '', false);
  }

  getDelta1Report(releasePackage: ReleasePackage) {
    this.teamCenterService.getDelta1ObjectId(releasePackage.sourceSystemID).subscribe((res) => {
        this.inlineProgressBar = false;
        if (res && res.deltaReportID) {
          let referenceId = '';
          res.ref.forEach(reference => {
            if (reference.type === 'excel') {
              referenceId = reference.ID;
            }
          });
          if (referenceId) {
            const delta1 = this.delta1URL.replace('{DELTA-REPORT-ID}', res.deltaReportID).replace('{EXCEL-REFERENCE-ID}', referenceId);
            window.open(delta1, '_blank', '', false);
          }
        }
      }, () => {
        this.inlineProgressBar = false;
      }
    );
  }
}
