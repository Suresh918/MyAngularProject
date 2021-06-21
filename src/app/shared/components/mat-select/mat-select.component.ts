import {Component, Input, OnChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {HistoryService} from '../../../core/services/history.service';

@Component({
  selector: 'mc-mat-select',
  templateUrl: './mat-select.component.html',
  styleUrls: ['./mat-select.component.scss']
})
export class MatSelectComponent implements OnChanges {
  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  descriptionControl: FormControl;
  @Input()
  descriptionControlConfiguration: FormControlConfiguration;
  @Input()
  showDescriptionForOptions: string[];
  @Input()
  changeDescription: boolean;
  @Input()
  floatLabel: string;
  @Input()
  historyFormControl: FormGroup;
  @Input()
  showOptionsHistory: boolean;
  @Input()
  historySize: number;
  @Input()
  controlType: string;

  constructor(private readonly historyService: HistoryService) {
  }

  ngOnChanges() {
    if (this.control) {
      this.control.setValue(String(this.control.value || ''));
    }
  }

  setHistory(selectedOption: any): void {
    if (this.historyFormControl) {
      this.historyService.setHistory(this.historyFormControl, selectedOption, this.controlType, this.historySize);
    }
  }

  hasValidator(): boolean {
    if (this.control && this.control.validator && this.control.validator({} as AbstractControl)) {
      return this.control.validator({} as AbstractControl).hasOwnProperty('required');
    } else {
      return false;
    }
  }

  selectionChange(selectedOption): void {
    if (this.showOptionsHistory) {
      this.setHistory(this.getSelectedOptionFromName(selectedOption.value));
    }
    if (this.changeDescription && this.changeDescription === true) {
      this.descriptionControlConfiguration.placeholder = 'Please explain why you choose for a ' + this.control.value.toLowerCase() + ' strategy';
    }
    if (this.descriptionControl) {
      this.descriptionControl.setValue('');
    }
  }

  getSelectedOptionFromName(optionName: string): FormControlConfiguration {
    for (const option of this.controlConfiguration.options) {
      if (option['name'] === optionName) {
        return option as FormControlConfiguration;
      }
    }
    return null;
  }

}
