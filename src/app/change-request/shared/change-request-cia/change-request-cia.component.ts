import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequest} from '../../../shared/models/mc.model';

@Component({
  selector: 'mc-change-request-cia',
  templateUrl: './change-request-cia.component.html',
  styleUrls: ['./change-request-cia.component.scss']
})
export class ChangeRequestCIAComponent implements OnInit {
  crId: string;
  showLoader: boolean;
  readOnlyCIAData: any;
  changeRequestData: ChangeRequest;
  changeRequestFormGroup: FormGroup;
  isProjectCR: boolean;
  isCreatorCR: boolean;

  constructor(public readonly activatedRoute: ActivatedRoute,
              public readonly changeRequestService: ChangeRequestService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly pageTitleService: PageTitleService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.crId = params.id;
    });
    this.changeRequestService.getReadOnlyCIAData(this.crId).subscribe((res) => {
      if (res && res.change_request) {
        // The below section of code is to store all the other properties from the response of the service, except change_request
        const key = 'change_request';
        this.changeRequestData = res.change_request;
        const { [key]: _, ...scope_details } = res;
        this.readOnlyCIAData = scope_details;
        this.pageTitleService.getPageTitleObject('ChangeRequest', 'CIA - CR-', this.crId,
          res.change_request.title, '');
        this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(res.change_request), [], []);
        this.showLoader = false;
        this.isCreatorCR = res.change_request.change_owner_type && res.change_request.change_owner_type.toUpperCase() === 'CREATOR';
        this.isProjectCR = res.change_request.change_owner_type === null || (res.change_request.change_owner_type && res.change_request.change_owner_type.toUpperCase() === 'PROJECT');
      }
    }, () => {
      this.showLoader = false;
    });
  }

}
