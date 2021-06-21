import {Component, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {Observable} from 'rxjs';
import {ReleasePackageService} from '../../../core/services/release-package.service';

@Component({
  selector: 'mc-auto-complete-release-package',
  templateUrl: './mc-auto-complete-release-package.component.html',
  styleUrls: ['./mc-auto-complete-release-package.component.scss']
})
export class MCAutoCompleteReleasePackageComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;

  constructor(private readonly releasePackageService: ReleasePackageService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly helpersService: HelpersService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dataSource = this.releasePackageService.getPrerequisiteReleasePackages.bind(this.releasePackageService);
  }

}
