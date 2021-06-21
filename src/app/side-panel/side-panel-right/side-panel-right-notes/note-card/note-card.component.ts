import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NoteElement, NoteSummaryElement} from '../../../../shared/models/mc.model';
import { environment } from '../../../../../environments/environment';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {FormGroup, Validators} from '@angular/forms';
import {Link} from '../../../../shared/models/mc-presentation.model';
import {FormControlConfiguration} from '../../../../shared/models/mc-configuration.model';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  @Input()
  noteSummary: NoteSummaryElement;
  @Input()
  currentUserID: string;
  @Input()
  caseObjectType: string;
  @Output()
  readonly editNote: EventEmitter<any> = new EventEmitter();
  @Output()
  readonly deleteNote: EventEmitter<any> = new EventEmitter();
  @Output()
  readonly saveForm: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly documentClick: EventEmitter<any> = new EventEmitter<any>();
  currentNoteLink: Link;
  noteForm: FormGroup;
  addNoteControlConfiguration: FormControlConfiguration;
  showEditDelete: boolean;
  docUrl: string;
  showEditNoteForm: boolean;

  constructor(private readonly mcFormGroupService: MCFormGroupService,
              private readonly helpersService: HelpersService) {
    this.showEditDelete = false;
    this.docUrl = `${environment.rootURL}mc${environment.version}/documents`;
  }


  ngOnInit() {
  }

  onEditPress(): void {
    this.editNote.emit(this.noteSummary);
  }

  onDeletePress(): void {
    this.deleteNote.emit(this.noteSummary);
  }

  documentClicked(document) {
    this.documentClick.emit(document);
  }

}
