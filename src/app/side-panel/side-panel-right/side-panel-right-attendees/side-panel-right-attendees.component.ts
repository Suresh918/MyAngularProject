import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {Agenda, AgendaItem, ChangeNotice, ChangeRequest, ReleasePackage, User, UserElement} from '../../../shared/models/mc.model';
import {AgendaState, MyChangeState} from '../../../shared/models/mc-store.model';
import {refreshLinkedItemsCount} from '../../../store';
import {selectAttendeeAgendaItem} from '../../../agenda/store';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {UserProfileService} from '../../../core/services/user-profile.service';

@Component({
  selector: 'mc-side-panel-right-attendees',
  templateUrl: './side-panel-right-attendees.component.html',
  styleUrls: ['./side-panel-right-attendees.component.scss']
})
export class SidePanelRightAttendeesComponent implements OnInit {
  @Input()
  caseObjectType: string;
  @Input()
  panelMode: string;
  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && (caseObject.ID || caseObject.id)) {
      this.caseObject = caseObject;
      this.setToggleOption();
      if (!this.previousID) {
        this.getAgendaItemAttendees();
        this.previousID = caseObject.ID;
      }
    }
  }
  previousID: string;
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem;
  attendeeFormConfiguration: FormControlConfiguration;
  attendeeControl: FormControl;
  progressBar: boolean;
  currentUser: User;
  selectedAttendees: any;
  allAttendees: any;
  allInvitedAttendeesCount: number;
  selectedAttendeesCount: number;
  toggleAttendeesViewControl: FormControl;
  caseObjectState: any;
  attendeesList: UserElement[];
  attendees = [];
  newAttendees = [];
  isGetMeetingsSuccessful: boolean;
  checked: boolean;
  CheckboxName: string;
  showAttendeeForm: boolean;
  showLoaderForSelectAll: boolean;
  attendeesFetched: boolean;

  constructor(private readonly configurationService: ConfigurationService,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService,
              private readonly agendaItemService: AgendaItemService,
              private readonly appStore: Store<MyChangeState>,
              private readonly agendaStore: Store<AgendaState>) {
    this.currentUser = new User(this.configurationService.getUserProfile());
    this.toggleAttendeesViewControl = new FormControl('');

    this.attendeeControl = new FormControl();
    this.attendeeFormConfiguration = {
      'ID': 'AttendeeSearch',
      'placeholder': 'Add Attendees',
      'label': 'Add Attendees',
      'help': 'Attendees Search Help'
    };
  }

  ngOnInit(): void {
    this.agendaStore.pipe(select(selectAttendeeAgendaItem)).subscribe((value: string) => {
      if (value) {
        this.caseObject['ID'] ? (this.caseObject['ID'] = value) : (this.caseObject['id'] = value);
        this.getAgendaItemAttendees();
      }
    });
  }

  setToggleOption(): void {
    this.caseObjectState = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
    this.toggleAttendeesViewControl = new FormControl(this.caseObjectState['commonCaseObjectState']['sidePanelNotesToggleOption'] || 'CASEOBJECT');
  }

  toggleAttendeesGroup(event): void {
    this.caseObjectState['commonCaseObjectState']['sidePanelNotesToggleOption'] = event.value;
    this.userProfileService.updateCaseObjectState(this.caseObjectState, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
    this.setAttendees();
  }

  toggleAllAttendees($event): void {
    this.attendees = [];
    const agendaItemID = this.caseObject['ID'] || this.caseObject['id'];
    this.showLoaderForSelectAll = true;
    if ($event.checked) {
      this.attendeesList.forEach(item => {
        item['checked'] = true;
        this.attendees.push(item.UserElement);
      });
      // this.progressBar = true;
      this.agendaItemService.addAttendees(agendaItemID, this.attendees).subscribe(res => {
        if (res) {
          //   this.progressBar = false;
          this.getAgendaItemAttendees(true);
        }
        this.showLoaderForSelectAll = false;
      }, () => {
        this.showLoaderForSelectAll = false;
      });
    } else {
      this.attendeesList.forEach(item => {
        item['checked'] = false;
        this.attendees.push(item.UserElement);
      });
      //  this.progressBar = true;
      this.agendaItemService.deleteAttendees(agendaItemID, this.attendees).subscribe(res => {
        if (res) {
          //   this.progressBar = false;
          this.getAgendaItemAttendees(true);
        }
        this.showLoaderForSelectAll = false;
      }, () => {
        this.showLoaderForSelectAll = false;
      });
    }
  }

  toggleAttendees($event, attendee): void {
    this.attendees = [];
    const agendaItemID = this.caseObject['ID'] || this.caseObject['id'];
    attendee['showLoader'] = true;
    if ($event.checked) {
      this.attendeesList.forEach(item => {
        if (item.UserElement.userID === attendee.UserElement.userID) {
          item['checked'] = true;
        }
      });
      this.attendees.push(attendee.UserElement);
      // this.progressBar = true;
      this.agendaItemService.addAttendees(agendaItemID, this.attendees).subscribe(res => {
        if (res) {
          this.appStore.dispatch(refreshLinkedItemsCount(true));
          // this.progressBar = false;
          this.selectedAttendees.push(attendee);
          this.selectedAttendeesCount = this.selectedAttendees.length;
          this.setAttendees();
        }
        attendee['showLoader'] = false;
      }, () => {
        // this.progressBar = false;
        attendee['showLoader'] = false;
        attendee['checked'] = false;
      });
    } else {
      /*this.attendeesList.forEach((item) => {
        if (item.UserElement.userID === attendee.UserElement.userID) {
          item['checked'] = false;
        }
      });*/
      this.attendees.push(attendee.UserElement);
      // this.progressBar = true;
      this.agendaItemService.deleteAttendees(agendaItemID, this.attendees).subscribe(res => {
        if (res) {
          this.appStore.dispatch(refreshLinkedItemsCount(true));
          // this.progressBar = false;
          this.handleDeselectedAttendees(this.attendees);
          // this.attendeesList.splice(this.attendeesList.findIndex(item => item.UserElement.userID === this.attendees[0].userID), 1);
          this.selectedAttendeesCount = this.selectedAttendees.length;
          this.setAttendees();
        }
        attendee['showLoader'] = false;
      }, () => {
        // this.progressBar = false;
        attendee['showLoader'] = false;
        attendee['checked'] = true;
      });
    }
  }

  handleDeselectedAttendees(attendees: User[]) {
    let matchedAttendee: UserElement;
    attendees.forEach(attendee => {
      this.selectedAttendees.splice(this.selectedAttendees.findIndex((item) => item.UserElement.userID === attendee.userID), 1);
      matchedAttendee = this.allAttendees.find(item => item.UserElement.userID === attendee.userID);
      matchedAttendee['checked'] = false;
      matchedAttendee['isSelected'] = false;
      if (!matchedAttendee['isFromExchange'] && !matchedAttendee['isSpecialInvitee']) {
        this.allAttendees.splice(this.allAttendees.findIndex((item) => item.UserElement.userID === attendee.userID), 1);
      }
    });
  }

  addAttendeeToList() {
    this.newAttendees = [];
    this.progressBar = true;
    const agendaItemID = this.caseObject['ID'] || this.caseObject['id'];
    if (this.attendeeControl.value) {
      this.attendeeControl.value.forEach(item => {
        if (!this.selectedAttendees || this.selectedAttendees.findIndex((ele) => ele.UserElement.userID === item.userID) === -1) {
          this.newAttendees.push(item);
        }
      });
    }
    if (this.newAttendees && this.newAttendees.length) {
      this.newAttendees = this.newAttendees.map((attendees) => new User(attendees));
      this.agendaItemService.addAttendees(agendaItemID, this.newAttendees).subscribe(res => {
        if (res) {
          this.appStore.dispatch(refreshLinkedItemsCount(true));
          this.newAttendees.forEach(attendee => {
            const object = {'UserElement': attendee, isSelected: true};
            this.selectedAttendees.push(object);
            if (this.allAttendees.findIndex(userElement => userElement.UserElement.userID === object.UserElement.userID) === -1) {
              this.allAttendees.push(object);
              this.allInvitedAttendeesCount++;
            } else {
              this.allAttendees.find(userElement => userElement.UserElement.userID === object.UserElement.userID)['isSelected'] = true;
            }
          });
          this.setAttendees();
          this.attendeeControl = new FormControl();
        }
        this.progressBar = false;
      });
    } else {
      this.attendeeControl = new FormControl();
      this.progressBar = false;
    }
  }

  setAttendees(): void {
    this.attendees = [];
    if (this.toggleAttendeesViewControl.value === 'ALL') {
      this.CheckboxName = 'Select All';
      this.attendeesList = this.allAttendees;
      if (this.allAttendees && this.allAttendees.findIndex((item) => item.isSelected === false) >= 0) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    } else if (this.toggleAttendeesViewControl.value === 'CASEOBJECT') {
      this.checked = true;
      this.CheckboxName = 'Deselect All';
      this.selectedAttendees.forEach(item => {
        item.checked = true;
      });
      this.attendeesList = this.selectedAttendees;
    }
    this.allInvitedAttendeesCount = this.allAttendees.length;
    this.selectedAttendeesCount = this.selectedAttendees.length;
  }

  getAgendaItemAttendees(refreshCount?: boolean) {
    this.progressBar = true;
    this.agendaItemService.getAgendaItemAttendees(this.caseObject['ID'] || this.caseObject['id']).subscribe(res => {
      if (res) {
        this.appStore.dispatch(refreshLinkedItemsCount(refreshCount));
        this.progressBar = false;
        this.showAttendeeForm = false;
        this.selectedAttendees = res.selected ? res.selected.Attendees : [];
        this.allAttendees = res.allInvited ? res.allInvited.Attendees : [];
        this.allInvitedAttendeesCount = res.allInvitedAttendeesCount;
        this.selectedAttendeesCount = res.selectedAttendeesCount;
        this.isGetMeetingsSuccessful = res.isGetMeetingsSuccessful;
        this.setAttendees();
      }
    }, () => {
      this.progressBar = false;
    });
  }

  onPressAddAttendee() {
    this.showAttendeeForm = true;
  }

}
