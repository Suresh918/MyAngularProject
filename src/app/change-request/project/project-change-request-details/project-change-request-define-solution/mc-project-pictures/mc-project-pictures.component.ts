import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';

import {
  ChangeRequestFormConfiguration,
  FormControlConfiguration
} from '../../../../../shared/models/mc-configuration.model';
import {ChangeRequest, Document, User} from '../../../../../shared/models/mc.model';
import {MCFormGroupService} from '../../../../../core/utilities/mc-form-group.service';
import {MyChangeState} from '../../../../../shared/models/mc-store.model';
import {environment} from '../../../../../../environments/environment';
import {refreshLinkedItemsCount} from '../../../../../store';
import {HelpersService} from '../../../../../core/utilities/helpers.service';
import {ChangeRequestService} from '../../../../change-request.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-project-pictures',
  templateUrl: './mc-project-pictures.component.html',
  styleUrls: ['./mc-project-pictures.component.scss']
})
export class McProjectPicturesComponent implements OnChanges {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  control: FormArray;
  @Input()
  isExpanded: boolean;
  @Input()
  pictureUrl: string;
  @Input()
  asIsControlConfiguration: FormControlConfiguration;
  @Input()
  toBeControlConfiguration: FormControlConfiguration;
  @Input()
  caseObjectId: string;
  @Input()
  caseObjectStatus: string;
  @Input()
  caseObject: string;
  asIsState: FormGroup;
  toBeState: FormGroup;
  index: number;
  showImageDiv: boolean;
  progressBar: boolean;
  currentIndex: number;
  disableDirection: string;
  picturesArray: Document[];
  public imageUrls: SafeUrl[];
  clipText: string;
  copiedFile: File;
  @ViewChild('form') formElement: ElementRef;
  asIsPictureImg: SafeUrl;
  toBePictureImg: SafeUrl;
  uploadedImage: ArrayBuffer;
  lastModifiedDate: any;
  name: string;
  private lastObjectUrl: string;
  private sanitizer: DomSanitizer;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly changeRequestService: ChangeRequestService,
              private readonly configurationService: ConfigurationService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly appStore: Store<MyChangeState>,
              public dialog: MatDialog,
              sanitizer: DomSanitizer) {
    this.pictureUrl = `${environment.rootURL}change-request-service/change-requests/documents`;
    this.asIsState = this.formBuilder.group({});
    this.toBeState = this.formBuilder.group({});
    this.showImageDiv = true;
    this.caseObjectId = '';
    this.sanitizer = sanitizer;
    this.imageUrls = [];
    this.lastObjectUrl = '';
    this.clipText = '';
  }

  pictureChange(picRef, pictureConfig): void {
    this.removeExistingPicture(pictureConfig.tag);
    const fileList: FileList = picRef.files;
    if (fileList.length > 0) {
      this.progressBar = true;
      const file: File = fileList[0];
      this.name = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(fileList[0]);

      reader.onload = (_event) => {
        this.uploadedImage = reader.result as ArrayBuffer;
      };

      const tags = [];
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('description', '');
      // do a service call here
      if ((pictureConfig.tag === 'AS-IS-PICTURE' && this.asIsState && this.asIsState.value && this.asIsState.value.id)
        || (pictureConfig.tag === 'TO-BE-PICTURE' && this.toBeState && this.toBeState.value && this.toBeState.value.id)) {
        this.changeRequestService.updateFile(this.caseObjectId, formData, pictureConfig.tag).subscribe(
          (fileObj) => {
            if (fileObj) {
              this.displayPicture(fileObj, pictureConfig);
              this.appStore.dispatch(refreshLinkedItemsCount(true));
            } else {
              this.progressBar = false;
            }
          });
      } else {
        formData.append('tags', pictureConfig.tag);
        this.changeRequestService.uploadFile(this.caseObjectId, formData, pictureConfig.tag).subscribe(
          (fileObj) => {
            if (fileObj) {
              this.displayPicture(fileObj, pictureConfig);
              this.appStore.dispatch(refreshLinkedItemsCount(true));
            } else {
              this.progressBar = false;
            }
          });
      }
      picRef.value = '';
    }
  }

  displayPicture(fileObject, pictureConfig) {
    if (fileObject && fileObject.id) {
      this.progressBar = false;
      const picObj: Document = {
        'name': fileObject.name,
        'creator': new User(this.configurationService.getUserProfile()),
        'created_on': fileObject.created_on || new Date(),
        'id': fileObject.id,
        'tags': [pictureConfig.tag]
      } as Document;
      if (picObj.tags.indexOf('AS-IS-PICTURE') > -1) {
        this.asIsPictureImg = this.sanitizer.bypassSecurityTrustUrl(this.uploadedImage as unknown as string);
        this.control.insert(0, this.mcFormGroupService.createDocumentFormGroup2(picObj));
        this.asIsState = this.formBuilder.group(picObj);
      } else if (picObj.tags.indexOf('TO-BE-PICTURE') > -1) {
        this.toBePictureImg = this.sanitizer.bypassSecurityTrustUrl(this.uploadedImage as unknown as string);
        this.control.push(this.mcFormGroupService.createDocumentFormGroup(picObj));
        this.toBeState = this.formBuilder.group(picObj);
      }
    }
  }

  removeExistingPicture(uploadedTag) {
    if (this.control && this.control.getRawValue()) {
      this.control.getRawValue().forEach((document, index) => {
        if (document.tags.includes(uploadedTag)) {
          this.control.removeAt(index);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.control && changes.control.currentValue && changes.control.currentValue.value.length > 0) {
      this.asIsState = changes.control.currentValue.controls.find(document =>
        document.value.tags.indexOf(this.asIsControlConfiguration.tag) > -1
      );
      const asIsImageURL = 'data:image/PNG;base64,' + (this.asIsState ? this.asIsState.get('content').value : '');
      this.asIsPictureImg = this.sanitizer.bypassSecurityTrustUrl(asIsImageURL);

      this.toBeState = changes.control.currentValue.controls.find(document =>
        document.value.tags.indexOf(this.toBeControlConfiguration.tag) > -1
      );
      const toBeImageURL = 'data:image/png;base64,' + (this.toBeState ? this.toBeState.get('content').value : '');
      this.toBePictureImg = this.sanitizer.bypassSecurityTrustUrl(toBeImageURL);
    }
  }

  remove(picId: number, state): void {
    this.progressBar = true;
    this.changeRequestService.removeFile(picId).subscribe(() => {
      this.progressBar = false;
      this.appStore.dispatch(refreshLinkedItemsCount(true));
    });
    for (let i = 0; i < this.control.value.length; i++) {
      if (picId === this.control.value[i].id) {
        this.control.removeAt(i);
        break;
      }
    }
    if (state.value.tags.indexOf('AS-IS-PICTURE') > -1) {
      this.asIsState = this.formBuilder.group({});
    } else if (state.value.tags.indexOf('TO-BE-PICTURE') > -1) {
      this.toBeState = this.formBuilder.group({});
    }
  }

  openImageDialog(index) {
    const dialogRef = this.dialog.open(AALLightBoxMultipleComponent, {
      maxWidth: '95vw',
      maxHeight: '95vw',
      data: this.generateLightBoxMultipleData(index)
    });
  }

  isCaseObjectInFinalState(): boolean {
    return HelpersService.isCaseObjectInFinalState(this.caseObject, this.caseObjectStatus);
  }

  pasteSelection(event, pictureConfiguration) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const index in items) {
      if (items[index].kind === 'file') {
        const blob = items[index].getAsFile();
        const reader = new FileReader();
        reader.onload = function (loadEvent) {
        }; // data url!
        reader.readAsDataURL(blob);
        const fileArray = [];
        fileArray.push(blob);
        this.pictureChange({'files': fileArray}, pictureConfiguration);
      }
    }
  }

  generateLightBoxMultipleData(index: number): LightBoxMultipleData {
    if ((this.asIsState && this.asIsState.get('name')) &&
      !(this.toBeState && this.toBeState.get('name'))) {
      const lightBoxMultipleData: LightBoxMultipleData = {
        index: index,
        // navigationTooltips: {left: '', right: ''},
        images: [{
          title: 'As-is',
          name: this.asIsState.get('name').value,
          url: this.pictureUrl + '/' + this.asIsState.get('id').value + '/content',
          uploadedBy: (this.asIsState.get('creator') && this.asIsState.get('creator').value.fullName),
          uploadedOn: (this.asIsState.get('created_on') && this.asIsState.get('created_on').value)
        }]
      };
      return lightBoxMultipleData;
    } else if (!(this.asIsState && this.asIsState.get('name')) &&
      (this.toBeState && this.toBeState.get('name'))) {
      const lightBoxMultipleData: LightBoxMultipleData = {
        index: index,
        // navigationTooltips: {left: '', right: ''},
        images: [{
          title: 'To-be',
          name: this.toBeState.get('name').value,
          url: this.pictureUrl + '/' + this.toBeState.get('id').value + '/content',
          uploadedBy: (this.toBeState.get('creator') && this.toBeState.get('creator').value.fullName),
          uploadedOn: (this.toBeState.get('created_on') && this.toBeState.get('created_on').value)
        }]
      };
      return lightBoxMultipleData;
    } else if ((this.asIsState && this.asIsState.get('name')) &&
      (this.toBeState && this.toBeState.get('name'))) {
      const lightBoxMultipleData: LightBoxMultipleData = {
        index: index,
        // navigationTooltips: {left: '', right: ''},
        images: [{
          title: 'As-is',
          name: this.asIsState.get('name').value,
          url: this.pictureUrl + '/' + this.asIsState.get('id').value + '/content',
          uploadedBy: (this.asIsState.get('creator') && this.asIsState.get('creator').value.fullName),
          uploadedOn: (this.asIsState.get('created_on') && this.asIsState.get('created_on').value)
        },
          {
            title: 'To-be',
            name: this.toBeState.get('name').value,
            url: this.pictureUrl + '/' + this.toBeState.get('id').value + '/content',
            uploadedBy: (this.toBeState.get('creator') && this.toBeState.get('creator').value.fullName),
            uploadedOn: (this.toBeState.get('created_on') && this.toBeState.get('created_on').value)
          }]
      };
      return lightBoxMultipleData;
    }
  }
}
