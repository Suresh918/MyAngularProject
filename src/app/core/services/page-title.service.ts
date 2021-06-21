import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

declare function _satellite();

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

  constructor(private readonly titleService: Title) {
  }

  setPageTitle(newTitle: string, caseObjectType?: string) {
    this.titleService.setTitle(newTitle);
  }

  getPageTitle(caseObjectType: string) {
    switch (caseObjectType) {
      case 'changeRequest':
        this.setPageTitle('Change Requests · myChange');
        return;
      case 'changeNotice':
        this.setPageTitle('Change Notices · myChange');
        return;
      case 'releasePackage':
        this.setPageTitle('Release Packages · myChange');
        return;
      case 'Agendas':
        this.setPageTitle('Agendas · myChange');
        return;
      case 'Reviews':
        this.setPageTitle('Reviews · myChange');
        return;
      case 'Decisions':
        this.setPageTitle('Decisions · myChange');
        return;
      case 'Actions':
        this.setPageTitle('Actions · myChange');
        return;
      case 'Home':
        this.setPageTitle('Home · myChange');
        return;
      case 'Tracker_Board':
        this.setPageTitle('Tracker Board · myChange');
        return;
      case 'Reports':
        this.setPageTitle('Reports · myChange');
        return;
      case 'Settings':
        this.setPageTitle('Settings · myChange');
        return;
      case 'UserRoles_Settings':
        this.setPageTitle('User Roles (Settings) · myChange');
        return;
      case 'Notifications_Settings':
        this.setPageTitle('Notifications (Settings) · myChange');
        return;
      case 'CBRules_Settings':
        this.setPageTitle('CB Rules (Settings) · myChange');
        return;
      case 'CBRules_Admin':
        this.setPageTitle('CB Rules (Admin) · myChange');
        return;
      case 'Admin':
        this.setPageTitle('Admin · myChange');
        return;
      case 'Announcements_Admin':
        this.setPageTitle('Announcements (Admin) · myChange');
        return;
      case 'HelpText_Admin':
        this.setPageTitle('Help Text (Admin) · myChange');
        return;
      case 'Agendas_Admin':
        this.setPageTitle('Agendas (Admin) · myChange');
        return;
      case 'Tags_Admin':
        this.setPageTitle('Tags (Admin) · myChange');
        return;
      case 'myTeam_Management_Admin':
        this.setPageTitle('myTeam Management (Admin) · myChange');
        return;
      case 'ProductsAffected_Admin':
        this.setPageTitle('Products Affected (Admin) · myChange');
        return;
    }
  }

  getPageTitleObject(caseObjectType, category, id, title, dateItem) {
    let titleObject;
    let date;
    switch (caseObjectType) {
      case 'ChangeRequest':
        if (category === '') {
          category = 'CR';
        }
        titleObject = category + ' ' + id + ' · ' + title;
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'ChangeNotice':
        if (category === '') {
          category = 'CN';
        }
        titleObject = category + ' ' + id + ' · ' + title;
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'ReleasePackage':
        if (!category) {
          category = 'RP';
        }
        titleObject = category + ' ' + id + ' · ' + title;
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'Review':
        titleObject = category + ' ' + '(' + id + ')';
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'Agendas':
        date = new AALDatePipe('en-US').transform(dateItem);
        if (title === '') {
          titleObject = category + ' ' + id + ' · ' + date;
        } else {
          titleObject = category + ' ' + id + ' - ' + title + ' - ' + date;
        }
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'Actions':
        date = new AALDatePipe('en-US').transform(dateItem);
        titleObject = category + ' ' + id + ' · ' + title + ' - ' + date;
        this.setPageTitle(titleObject + ' · myChange');
        return;
      case 'AgendaItem':
        titleObject = category + ' · ' + id + ' · ' + title;
        this.setPageTitle(titleObject + ' · myChange');
    }
  }
}
