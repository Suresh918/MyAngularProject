import {Favorite} from './mc-presentation.model';
import {DashboardWidgetConfiguration, DashboardWidgetConfigurationState} from '../../dashboard/dashboard.model';
import {McStatesModel} from './mc-states-model';
import {NotificationConfiguration} from '../../settings/notification-settings/notification-settings.model';

export class UserProfile {
  user?: UserObject;
  firstModified?: Date;
  lastModified?: Date;
  full_name: string;
  email: string;
  employee_number: string;
  abbreviation: string;
  department_name: string;
  roles: string[];
  memberships: string[];
  notificationConfiguration?: NotificationConfiguration;
  user_id: string;
  last_accessed_on: Date;
}

export class UserObject {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  abbreviation: string;
  departmentName: string;
  memberships: Membership[];
  roles?: string[];
  favorites?: Favorite[];
  state?: string;
  notificationConfiguration?: NotificationConfiguration;
  userID: string;

  constructor(userProfile: UserObject) {
    userProfile = userProfile || {} as UserObject;
    userProfile.state = userProfile.state || JSON.stringify(new McStatesModel());
    userProfile.notificationConfiguration = new NotificationConfiguration(userProfile.notificationConfiguration);
    return userProfile;
  }
}

export interface Membership {
  category: string;
  groups: Group[];
}

export  class Group {
   name?: string;
  group_id?: string;
}
