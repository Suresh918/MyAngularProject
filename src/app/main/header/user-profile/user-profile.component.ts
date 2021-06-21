import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input()
  userProfile: any;
  roles: string[];
  groups: string[];

  constructor(private readonly configurationService: ConfigurationService,
              private readonly router: Router) {

  }

  ngOnInit() {
    this.arrangeUserProfile();
  }

  arrangeUserProfile(): void {
    this.groups = [];
    this.roles = [];
    this.userProfile = this.configurationService.getUserProfile();
    if (this.userProfile && this.userProfile.roles && this.userProfile.roles.length > 0) {
      this.userProfile.roles.forEach(role => {
        if (role.includes('change-specialist') || role.includes('member') || role.includes('administrator') || role.includes('user')) {
          this.roles.push(this.getDisplayedRole(role));
        }
      });
      if (this.userProfile && this.userProfile.memberships && this.userProfile.memberships.length > 0) {
        this.userProfile.memberships.forEach(membership => {
          if (membership.includes('-ccb-') || membership.includes('-cb-')) {
            this.groups.push(membership.toUpperCase());
          }
        });
      }
      /**
       * Digital data track
       * */
      const userRoles = this.roles.toString().split(',').join('|');
      window['digitalData'].events.push({
        eventName: 'userRoleName',
        eventText: userRoles
      });
    }
  }

  getDisplayedRole(role: string): string {
    switch (role) {
      case 'change-specialist-1' : return 'Change Specialist 1';
      case 'change-specialist-2' : return 'Change Specialist 2';
      case 'change-specialist-3' : return 'Change Specialist 3';
      case 'administrator' : return 'Administrator';
      case 'member' : return 'Member';
      case 'user' : return 'User';
    }
  }

  logout(): void {
    this.configurationService.logoutUser().subscribe((response) => {
      if (response) {
        window.open(response.url, '_self');
      }
    });
  }
}
