import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {ProjectService} from '../../../core/services/project.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {Observable, of} from 'rxjs';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ManageProductsAffectedService} from '../../../admin/products-affected/products-affected.service';

@Component({
  selector: 'mc-auto-complete-products-affected-multiple',
  templateUrl: './mc-auto-complete-products-affected-multiple.component.html',
  styleUrls: ['./mc-auto-complete-products-affected-multiple.component.scss']
})
export class MCAutoCompleteProductsAffectedMultipleComponent extends MCFieldComponent implements OnInit {
  dataSource: any;
  productsAffectedList: any[];
  @Input()
  productsList: any[];
  resetList: boolean;
  constructor(private readonly projectService: ProjectService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              private readonly serviceParametersService: ServiceParametersService,
              private readonly productsAffectedService: ManageProductsAffectedService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.productsAffectedList = this.productsList;
    this.dataSource = this.filterProductsAffectedList.bind(this);
  }

  filterProductsAffectedList(value?) {
    if (!value) {
      return of(this.productsAffectedList);
    } else {
      this.resetList = false;
      return of(this.productsAffectedList.filter(item => item.toLowerCase().includes(value.toLowerCase())));
    }
  }

  checkIfInProductList(event) {
    if (typeof event === 'string') {
      const checkList = this.productsAffectedList.filter(item => item === event);
      if (checkList.length === 0) {
        const currentValue = this.control.value;
        currentValue.pop();
        currentValue.push('Other: ' + event);
        this.control.setValue(currentValue);
      }
    }
  }

  onFocus() {
    const element = document.getElementsByClassName('mat-input-element');
    if (element[0].innerHTML === '') {
      this.resetList = true;
    }
  }

}
