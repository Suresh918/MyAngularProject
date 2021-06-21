import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {Links} from '../../../shared/models/mc-presentation.model';

@Component({
  selector: 'mc-external-apps',
  templateUrl: './external-apps.component.html',
  styleUrls: ['./external-apps.component.scss']
})
export class ExternalAppsComponent implements OnInit {
  quickLinkParameters: string[] = ['TrainingVideos', 'FAQ', 'ServiceNow', 'SharePoint', 'Spotfire', 'BSNLaunchPad'];
  firstSet: any[];
  secondSet: any[];
  linksConfiguration: Links[];
  externalLinkConfiguration: Links[];

  constructor( public readonly configurationService: ConfigurationService) {
  }

  ngOnInit() {
    this.externalLinkConfiguration = [];
    this.linksConfiguration = this.configurationService.getLinks();
    this.quickLinkParameters.forEach(parameter => {
      this.linksConfiguration.forEach(link => {
        if (link.name === parameter) {
          this.externalLinkConfiguration.push(link);
        }
      });
    });
    this.firstSet = this.externalLinkConfiguration.slice(0, 3);
    this.secondSet = this.externalLinkConfiguration.slice(3);
  }

}
