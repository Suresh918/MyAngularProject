import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

import {CaseObject, ChangeRequest} from '../../../../shared/models/mc.model';
import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {ChangeRequestService} from '../../../change-request.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'mc-project-defining-solution',
  templateUrl: './project-defining-solution.component.html',
  styleUrls: ['./project-defining-solution.component.scss']
})
export class ProjectDefiningSolutionComponent {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  set changeRequestData(data: ChangeRequest) {
    if (data && data.id) {
      this.changeRequestDataValue = data;
      const serviceList = [this.changeRequestService.getChangeRequestDocuments(data.id, 'AS-IS-PICTURE'),
        this.changeRequestService.getChangeRequestDocuments(data.id, 'TO-BE-PICTURE')];
      forkJoin(serviceList).subscribe(resList => {
        this.documents = [...resList[0], ...resList[1]];
      });
    }
  }
  get changeRequestData() {
    return this.changeRequestDataValue;
  }
  @Input()
  fontSize: string;
  @Input()
  pictureUrl: string;
  @Input()
  isExpanded: boolean;
  @Input()
  AIRItems: any[];
  @Input()
  PBSItem: any[];
  @Input()
  caseObject: CaseObject;
  @Input()
  getLabel: (value) => string;
  @Input()
  getLabelAndDescription: (value, description) => string;
  disableDirection: string;
  documents: any[];
  changeRequestDataValue: ChangeRequest;

  constructor(public dialog: MatDialog, public changeRequestService: ChangeRequestService) {
  }

  openImageDialog(index) {
    this.dialog.open(AALLightBoxMultipleComponent, {
      maxWidth: '95vw',
      maxHeight: '95vw',
      data: this.generateLightBoxMultipleData(index)
    });
  }

  generateLightBoxMultipleData(index: number): LightBoxMultipleData {
    let asIsPicture: any = {};
    let toBePicture: any = {};
    this.documents.forEach(document => {
      if (document.tags.indexOf('AS-IS-PICTURE') > -1) {
        asIsPicture = document;
      }
      if (document.tags.indexOf('TO-BE-PICTURE') > -1) {
        toBePicture = document;
      }
    });
    return {
      index: index,
      // navigationTooltips: {left: '', right: ''},
      images: [{
        title: 'As-is',
        name: asIsPicture.name,
        url: this.pictureUrl + '/' + asIsPicture.id + '/content',
        uploadedBy: asIsPicture.creator.full_name,
        uploadedOn: asIsPicture.created_on
      },
        {
          title: 'To-be',
          name: toBePicture.name,
          url: this.pictureUrl + '/' + toBePicture.id + '/content',
          uploadedBy: toBePicture.creator.full_name,
          uploadedOn: toBePicture.created_on
        }]
    };
  }
}
