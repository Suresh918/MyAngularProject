import {Component, Input, OnInit} from '@angular/core';
import {DIA, DIABOM} from '../../models/cerberus.model';
import {Router} from '@angular/router';
import {CerberusService} from '../../../core/services/cerberus.service';
import {CaseObject} from '../../models/mc.model';
import {CaseObjectServicePath} from "../case-object-list/case-object.enum";
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-dia',
  templateUrl: './mc-dia.component.html',
  styleUrls: ['./mc-dia.component.scss']
})
export class MCDiaComponent implements OnInit {
  deepLinkTeamcenterURL: string;
  deepLinkChangeRequestDIAURL: string;
  deepLinkChangeNoticeDIAURL: string;
  delta2URL: string;
  dia: DIA;
  diabom: DIABOM;
  @Input()
  caseObjectType: string;
  @Input()
  disabled: boolean;
  @Input()
  caseObjectID: string;
  @Input()
  secondaryCaseObjectID: string;
  caseObject: CaseObject;

  constructor(private readonly router: Router,
              private readonly cerberusService: CerberusService,
              public readonly configurationService: ConfigurationService) {
  }

  ngOnInit() {
    this.caseObject = {
      ID: this.caseObjectID,
      revision: 'AA',
      type: this.caseObjectType
    };
    this.deepLinkTeamcenterURL = this.configurationService.getLinkUrl('Teamcenter');
    this.deepLinkChangeRequestDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CR');
    this.deepLinkChangeNoticeDIAURL = this.configurationService.getLinkUrl('DIA-BOM-CN');
  }

  getDIABOM(): void {
    switch (this.caseObjectType) {
      case 'ChangeRequest': {
        this.cerberusService.getDIABOMDetails(this.caseObjectID, CaseObjectServicePath[this.caseObjectType])
          .subscribe((res) => {
          this.dia = res;
        });
        break;
      }
      case 'ChangeNotice': {
        this.cerberusService.getChangeNoticeDIABOM(this.caseObjectID).subscribe((res) => {
          this.diabom = res;
        });
        break;
      }
      case 'ReleasePackage': {
        this.cerberusService.getDIABOMDetails(this.caseObjectID, CaseObjectServicePath[this.caseObjectType]).subscribe((res) => {
          this.dia = res;
        });
        break;
      }
    }
  }


  openDIABOM(dia): void {
    let deepLinkDIAURL = '';
    let caseObjectID: string = this.caseObjectID;
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
        caseObjectID = this.secondaryCaseObjectID;
        break;
      }
    }
    if (dia.revision === 'Working') {
      window.open(`${deepLinkDIAURL}${caseObjectID}`, '_blank', '', false);
    } else {
      window.open(`${deepLinkDIAURL}${caseObjectID}&revId=${dia.revision}`, '_blank', '', false);
    }
  }

}
