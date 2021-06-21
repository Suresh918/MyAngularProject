import { Pipe, PipeTransform } from '@angular/core';
import { PreferredRoleFormConfiguration } from '../models/mc-presentation.model';
import {ConfigurationService} from '../../core/services/configurations/configuration.service';
import {PreferredRolesService} from '../../core/services/configurations/services/preferred-roles.service';
@Pipe({
  name: 'userRoleTransform'
})
export class UserRoleTransformPipe implements PipeTransform {
  preferredRoleList: any;

  constructor(private readonly configurationService: ConfigurationService,
              private readonly preferredRolesService: PreferredRolesService) {
    this.preferredRoleList = this.preferredRolesService.ROLES_DETAILS as PreferredRoleFormConfiguration;
  }
  transform(roles) {
    if (roles) {
      roles = roles.map(role => {
        if (this.preferredRoleList[role]) {
          return this.preferredRoleList[role]['label'];
        }
      });
      roles = roles.filter((role, index) => roles.indexOf(role) === index);
      return roles.join(', ');
    } else {
      return '';
    }
  }
}
