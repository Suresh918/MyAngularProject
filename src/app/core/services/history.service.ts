import {Injectable} from '@angular/core';
import {DEFAULT_FORM_FIELD_HISTORY_SIZE} from '../utilities/mc-constants';
import {ActionHistoryModel, HistoryModel} from '../../shared/models/mc-history-model';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private readonly formBuilder: FormBuilder) {
  }

  createHistoryFormGroup(data: HistoryModel): FormGroup {
    data = data || {};
    return this.formBuilder.group({
      PCCSTRAIMIDs: [data.PCCSTRAIMIDs || []],
      PBSIDs: [data.PBSIDs || []],
      productID: [data.productID || []],
      projectID: [data.projectID || []],
      role: [data.role || []],
      user: [data.user || []],
      group: [data.group || []]
    });
  }

  createActionHistoryFormGroup(data: ActionHistoryModel): FormGroup {
    data = data || {};
    return this.formBuilder.group({
      type: [data.type || []],
      assignee: [data.assignee || []],
    });
  }

  setHistory(formControl: FormControl | FormGroup, newValue: any, type: string, size: number) {
    const currentHistoryValue = formControl.value || [];
    const newHistoryValue = this.updateFormFieldHistory(currentHistoryValue, newValue, type, size);
    if (newHistoryValue) {
      (formControl as AbstractControl).setValue(newHistoryValue);
    }
  }

  updateFormFieldHistory(currentHistory: any, newValue: any, type: string, size: number) {
    if (this.hasNullValues(newValue, type)) {
      return;
    }
    currentHistory = this.filterHistoryIfNewValueExists(currentHistory, newValue, type);
    size = size || DEFAULT_FORM_FIELD_HISTORY_SIZE;
    if (currentHistory && currentHistory.length >= size) {
      currentHistory = currentHistory.slice(0, size - 1);
      currentHistory.unshift(newValue);
    } else {
      currentHistory.unshift(newValue);
    }
    return currentHistory;
  }

  hasNullValues(newValue: any, type: string): boolean {
    if (type === 'user') {
      return !newValue || !newValue.userID;
    } else if (type === 'projectID') {
      return !newValue || !newValue.wbsElement;
    } else if (type === 'productID') {
      return !newValue || !newValue.projectDefinition;
    } else if (type === 'PCCSTRAIMIDs') {
      return !newValue || !newValue.number;
    } else if (type === 'PBSIDs') {
      return !newValue || !newValue.ID;
    } else {
      return !newValue || !newValue.name;
    }
  }

  filterHistoryIfNewValueExists(currentHistory: any[], newValue: any, type: string): any[] {
    if (currentHistory.length <= 0) {
      return currentHistory;
    } else if (type === 'user') {
      return currentHistory.filter(history => (history['userID'] !== newValue.userID));
    } else if (type === 'projectID') {
      return currentHistory.filter(history => (history['wbsElement'] !== newValue.wbsElement));
    } else if (type === 'productID') {
      return currentHistory.filter(history => (history['projectDefinition'] !== newValue.projectDefinition));
    } else if (type === 'PCCSTRAIMIDs') {
      return currentHistory.filter(history => (history['number'] !== newValue.number));
    } else if (type === 'PBSIDs') {
      return currentHistory.filter(history => (history['ID'] !== newValue.ID));
    } else {
      return currentHistory.filter(history => (history['name'] !== newValue.name));
    }
  }

}
