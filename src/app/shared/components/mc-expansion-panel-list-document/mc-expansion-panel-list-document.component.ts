import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormArray} from '@angular/forms';
import {Store} from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';


import {ChangeNotice, ChangeRequest, Document, ReleasePackage, User} from '../../models/mc.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FileService} from '../../../core/services/file.service';
import {refreshLinkedItemsCount} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {environment} from '../../../../environments/environment';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ReleasePackageDetailsService} from '../../../release-package/release-package-details/release-package-details.service';
import {SidePanelService} from '../../../side-panel/side-panel.service';

@Component({
  selector: 'mc-expansion-panel-list-document',
  templateUrl: './mc-expansion-panel-list-document.component.html',
  styleUrls: ['./mc-expansion-panel-list-document.component.scss'],
  providers: [ChangeRequestService, ReleasePackageDetailsService, SidePanelService]
})
export class MCExpansionPanelListDocumentComponent implements OnInit, OnChanges {
  @Input()
  set controlConfiguration(value: FormControlConfiguration) {
    this.configuration = value;
    if (!this.configuration.tag) {
      this.configuration.label.includes('CBC') ? this.configuration.tag = 'CBC' : this.configuration.label.includes('SCIA') ? this.configuration.tag = 'SCIA' :
        this.configuration.label.includes('LIP') ? this.configuration.tag = 'LIP' : this.configuration.label.includes('SCIP') ? this.configuration.tag = 'SCIP' : this.configuration.tag = '';
    }
  }
  get controlConfiguration() {
    return this.configuration;
  }
  @Input()
  control: FormArray;;
  @Input()
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage;
  @Input()
  caseObjectType: string;
  @Input()
  header: string;
  @Input()
  isExpanded?: boolean;
  @Input()
  tag?: string;
  @Input()
  uploadAllowed: boolean;
  @Input()
  deleteAllowed: boolean;
  documentFormArray: FormArray;
  expansionPanelItemConfigurationList: ExpansionPanelItemConfiguration[];
  filteredList: Document[];
  isBusy: boolean;
  emptyStateData: EmptyStateData;
  docUrl: string;
  configuration: FormControlConfiguration;

  constructor(private readonly helpersService: HelpersService,
              private readonly configurationService: ConfigurationService,
              private readonly fileService: FileService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly releasePackageService: ReleasePackageDetailsService,
              private readonly sidePanelService: SidePanelService,
              public readonly appStore: Store<MyChangeState>,
              private readonly mcFormGroupService: MCFormGroupService,
              public readonly customAlert: MatSnackBar) {
    this.isBusy = false;
    this.filteredList = [];
    this.docUrl = this.caseObjectType === 'ChangeRequest' ? `${environment.rootURL}change-request-service/change-requests/documents`
      : this.caseObjectType === 'ReleasePackage' ? `${environment.rootURL}release-package-service/release-packages/documents`
        : `${environment.rootURL}mc${environment.version}/documents`;
  }

  ngOnInit() {
    this.documentFormArray = new FormArray([]);
    this.createItemList();
    this.emptyStateData = {
      title: 'No ' + this.header ,
      subTitle: this.caseObjectType !== 'ACTION' ? ('Uploaded ' + this.header + 's Will Appear Here') : 'Uploaded Documents Will Appear Here',
      icon: 'insert_drive_file'
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.control && changes.control.currentValue) {
      this.filteredList = changes.control.currentValue.value.filter(document => document.tags.indexOf(this.configuration.tag) > -1);
      this.createItemList();
    } else if (changes.documentFormArray && changes.documentFormArray.currentValue) {
      this.filteredList = changes.documentFormArray.currentValue.value.filter(document => document.tags.indexOf(this.configuration.tag) > -1);
      this.createItemList();
    } else if (changes.caseObject && changes.caseObject.currentValue && ((changes.caseObject.previousValue && changes.caseObject.previousValue.id !== changes.caseObject.currentValue.id) || changes.caseObject.previousValue === undefined)) {
      this.getDocuments();
    }
  }

  createItemList() {
    this.expansionPanelItemConfigurationList = this.filteredList.map((document: Document) => {
      const expansionPanelItemConfiguration = new ExpansionPanelItemConfiguration();
      expansionPanelItemConfiguration.ID = document.ID;
      expansionPanelItemConfiguration.title = document.name;
      expansionPanelItemConfiguration.mainDescription = document.uploadedOn;
      expansionPanelItemConfiguration.line1 = document.uploadedBy.fullName;
      expansionPanelItemConfiguration.line1Caption = document.uploadedBy.abbreviation;
      expansionPanelItemConfiguration.isClickable = true;
      expansionPanelItemConfiguration.showActionButtonOnFocus = true;
      expansionPanelItemConfiguration.icon = 'insert_drive_file';
      expansionPanelItemConfiguration.error = new Info('');
      expansionPanelItemConfiguration.actionButtonConfiguration = new ActionButtonConfiguration();
      expansionPanelItemConfiguration.actionButtonConfiguration.action = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonIcon = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonType = 'icon';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonTooltip = 'Remove link';
      expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton = (this.deleteAllowed || this.deleteAllowed === false) ? this.deleteAllowed : this.uploadAllowed;
      return expansionPanelItemConfiguration;
    });
  }

  onDocumentAdd(docRef): void {
    const fileList: FileList = docRef.files;
    const fileSize = fileList && fileList[0] && fileList[0].size ? ((fileList[0].size / 1024) / 1024).toFixed(4) : '';
    if (fileList.length > 0 && parseInt(fileSize, 10) <= 50) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
        formData.append('file', file);
        formData.append('description', '');
        formData.append('tags', this.configuration.tag);
        this.isBusy = true;
        this.sidePanelService.uploadDocument(formData, this.caseObject['id'], this.caseObjectType).subscribe(res => {
          if (res && res.id) {
            this.isBusy = false;
            const docObject: Document = {
              'name': res.name,
              'uploadedBy': new User(this.configurationService.getUserProfile()),
              'uploadedOn': res.created_on || new Date(),
              'ID': res.id,
              'tags': [this.configuration.tag],
            } as Document;
            this.documentFormArray.push(this.mcFormGroupService.createDocumentFormGroup(docObject));
            this.filteredList = this.documentFormArray.value.filter(document =>
              document.tags.indexOf(this.configuration.tag) > -1
            );
            this.createItemList();
          }
          this.refreshSidePanel();
        },
          (err) => {
            this.isBusy = false;
        });
        docRef.value = '';
      } else {
        formData.append('xxxxxx', this.caseObject['ID'] || this.caseObject['id']);
        formData.append('file-name', file, file.name);
        formData.append('case-id', this.caseObject['ID'] || this.caseObject['id']);
        formData.append('case-type', this.helpersService.getCaseObjectForms(this.caseObjectType).caseObject);
        if (this.caseObjectType !== 'ACTION') {
          formData.append('case-revision', this.caseObject['revision'] || 'AA');
        }
        formData.append('description', '');
        formData.append('tags', this.configuration.tag);
        this.isBusy = true;
        // do a service call here
        this.fileService.uploadFile(formData).subscribe(
          (fileObj: any) => {
            this.isBusy = false;
            if (fileObj && fileObj.DocumentElement) {
              const docObject: Document = {
                'name': fileObj.DocumentElement.name,
                'uploadedBy': new User(this.configurationService.getUserProfile()),
                'uploadedOn': fileObj.DocumentElement.updatedOn || new Date(),
                'ID': fileObj.DocumentElement.ID,
                'tags': [this.configuration.tag]
              } as Document;
              this.control.push(this.mcFormGroupService.createDocumentFormGroup(docObject));
              this.filteredList = this.control.value.filter(document =>
                document.tags.indexOf(this.configuration.tag) > -1
              );
              this.createItemList();
            }
            this.refreshSidePanel();
          },
          (err) => {
            this.isBusy = false;
          });
        docRef.value = '';
      }
    } else {
      this.customAlert.open(`The File you are attaching is bigger than 50MB, Please reduce the file size and try again`, '', {duration: 2000});
    }
  }

  refreshSidePanel() {
    this.appStore.dispatch(refreshLinkedItemsCount(true));
  }

  remove(doc): void {
    this.isBusy = true;
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.sidePanelService.removeDocument(doc.ID, this.caseObjectType).subscribe(() => {
        this.isBusy = false;
        this.refreshSidePanel();
      });
      for (let i = 0; i < this.documentFormArray.value.length; i++) {
        if (doc.ID === this.documentFormArray.value[i].ID) {
          this.documentFormArray.removeAt(i);
          this.filteredList = this.documentFormArray.value.filter(document =>
            document.tags.indexOf(this.configuration.tag) > -1
          );
          this.createItemList();
          break;
        }
      }
    } else {
      this.fileService.removeFile(doc.ID).subscribe(() => {
        this.isBusy = false;
        this.refreshSidePanel();
      });
      for (let i = 0; i < this.control.value.length; i++) {
        if (doc.ID === this.control.value[i].ID) {
          this.control.removeAt(i);
          this.filteredList = this.control.value.filter(document =>
            document.tags.indexOf(this.configuration.tag) > -1
          );
          this.createItemList();
          break;
        }
      }
    }
  }

  downloadFile(event) {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      const data = this.filteredList.filter(item => item.ID === event)[0];
      this.sidePanelService.getDocumentContent$(event, this.caseObjectType).subscribe((documentData: any) => {
        this.helpersService.downloadAttachmentOnClick(data, documentData);
      });
    } else {
      window.open(`${this.docUrl}/${event}`, '_self');
    }
  }

  getDocuments() {
    if (this.caseObjectType === 'ChangeRequest' && this.configuration.tag && this.caseObject['id']) {
      this.changeRequestService.getChangeRequestDocuments(this.caseObject['id'], this.configuration.tag).subscribe(res => {
        if (res && res.length > 0) {
          res.forEach(doc => {
            this.documentFormArray.push(this.mcFormGroupService.createDocumentFormGroup(this.processDocumentResponse(doc)));
            this.filteredList = this.documentFormArray.value.filter(document =>
              document.tags.indexOf(this.configuration.tag) > -1
            );
          });
          this.createItemList();
        }
      });
    } else if (this.caseObjectType === 'ReleasePackage' && this.configuration.tag && this.caseObject['id']) {
      this.releasePackageService.getDocumentByTag(this.caseObject['id'], this.configuration.tag).subscribe(res => {
        if (res && res.length > 0) {
          res.forEach(doc => {
            this.documentFormArray.push(this.mcFormGroupService.createDocumentFormGroup(this.processDocumentResponse(doc)));
            this.filteredList = this.documentFormArray.value.filter(document =>
              document.tags.indexOf(this.configuration.tag) > -1
            );
          });
          this.createItemList();
        }
      });
    }
  }

  processDocumentResponse(response) {
    let ProcessedResponse = {};
    if (response) {
      ProcessedResponse = {
        ID: response['id'] ? response['id'] : '',
        name: response['name'] ? response['name'] : '',
        tags: response['tags'] ? response['tags'] : [],
        description: response['description'] ? response['description'] : '',
        uploadedBy: response['creator'] ? new User(response['creator']) : new User({}),
        uploadedOn: response['created_on'] ? response['created_on'] : '',
        content: response['content'] ? response['content'] : ''
      };
    }
    return ProcessedResponse as Document;
  }
}
