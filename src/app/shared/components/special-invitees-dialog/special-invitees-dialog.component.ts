import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';

import {CaseObject, User} from '../../models/mc.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {AgendaService} from '../../../core/services/agenda.service';
import {MyChangeState} from '../../models/mc-store.model';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {AgendaItemService} from '../../../core/services/agenda-item.service';

@Component({
  selector: 'mc-special-invitees-dialog',
  templateUrl: './special-invitees-dialog.component.html',
  styleUrls: ['./special-invitees-dialog.component.scss']
})
export class SpecialInviteesDialogComponent implements OnInit {
  userSearchControl: FormControl;
  userSearchControlMode: string;
  caseObject: CaseObject;
  userSearchControlConfiguration: FormControlConfiguration;
  showAddSection: boolean;
  newInvitees: User[];
  currentInvitees: User[];
  progressBar: boolean;
  currentInviteesCount: number;

  constructor(public dialogRef: MatDialogRef<SpecialInviteesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public readonly agendaService: AgendaService,
              public readonly agendaItemService: AgendaItemService,
              private readonly storeHelperService: StoreHelperService,
              private readonly appStore: Store<MyChangeState>) {
    this.userSearchControl = new FormControl([]);
    this.caseObject = new CaseObject(data.ID, '', 'AgendaItem');
    this.userSearchControlConfiguration = {
      'ID': 'specialInviteesSearch',
      'placeholder': 'Add Special Invitee',
      'label': 'Add Special Invitee'
    };
  }

  ngOnInit() {
    this.showAddSection = false;
    this.newInvitees = [];
    this.currentInvitees = [];
    this.currentInviteesCount = 0;
    this.userSearchControlMode = 'EDIT';
    if (this.data.displayAttendees) {
      this.fetchAttendees();
    } else {
      this.fetchSpecialInvitees();
    }
  }

  fetchAttendees() {
    this.progressBar = true;
    const isLookupRequired = false;
    this.agendaItemService.getAgendaItemAttendees(this.data.ID, isLookupRequired).subscribe(data => {
      this.currentInvitees = data.selected ? (data.selected.Attendees.map((attendee) => attendee.UserElement)) : [];
      this.currentInviteesCount = data.selectedAttendeesCount;
      this.progressBar = false;
    });
  }

  fetchSpecialInvitees() {
    this.progressBar = true;
    this.agendaService.getSpecialInvitees(this.data.ID).subscribe(data => {
      this.currentInvitees = data.specialInvitees || [];
      this.currentInviteesCount = this.currentInvitees.length;
      this.progressBar = false;
    });
  }

  onUserSelect(data) {
    const selectedInvitees = [...this.currentInvitees, ...this.userSearchControl.value];
    this.currentInviteesCount = selectedInvitees.length;
  }

  close() {
    this.dialogRef.close(this.currentInvitees);
  }

  onAddPress() {
    this.showAddSection = true;
  }

  onSave() {
    const totalInvitees = [...this.currentInvitees, ...this.userSearchControl.value];
    const uniqueInviteeList = totalInvitees.filter((user, i, arr) => arr.map(mapObj => mapObj.userID).indexOf(user.userID) === i);
    const totalInviteesAsUserObj = uniqueInviteeList.map((obj) => new User(obj));
    const isSameSetOfUsers = uniqueInviteeList.every(user => {
      return this.currentInvitees.findIndex(invitee =>  invitee.userID === user.userID) > -1;
    });
    if (isSameSetOfUsers) {
      this.currentInvitees = uniqueInviteeList;
      this.currentInviteesCount = uniqueInviteeList.length;
      this.resetSearchControl();
    } else {
      this.agendaService.addSpecialInvitee(this.data.ID, totalInviteesAsUserObj).subscribe((data) => {
        this.currentInvitees = totalInvitees;
        this.currentInviteesCount = totalInvitees.length;
        this.resetSearchControl();
      }, err => {
      });
    }
  }

  resetSearchControl() {
    this.userSearchControl.setValue([]);
    this.showAddSection = false;
  }

  onDeleteInvitee(index: number) {
    const currentInvitee = this.currentInvitees.map((obj) => new User(obj))[index];
    this.currentInvitees[index]['deleteInProgress'] = true;
    this.agendaService.deleteSpecialInvitee(this.data.ID, currentInvitee).subscribe((data) => {
      this.currentInvitees.splice(index, 1);
      this.currentInviteesCount = this.currentInvitees.length;
      currentInvitee['deleteInProgress'] = false;
    }, err => {
      currentInvitee['deleteInProgress'] = false;
    });
  }
}
