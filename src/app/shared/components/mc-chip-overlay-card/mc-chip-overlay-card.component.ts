import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-chip-overlay-card',
  templateUrl: './mc-chip-overlay-card.component.html',
  styleUrls: ['./mc-chip-overlay-card.component.scss']
})
export class McChipOverlayCardComponent implements OnInit {
  solutionItems: any[];
  solutionItemsOnOverlay: any;
  chips: any;
  totalGroups: any;
  @Input()
  showCategories: boolean;
  @Input()
  hideSectionDivider: boolean;
  @Input()
  headerTitle: string;
  @Input()
  disableImageUrl: boolean;
  @Input()
  set chipsData(chips: any) {
    this.chips = chips;
    const tempSolutionItem = [];
    if (this.chips && !Array.isArray(this.chips) && typeof this.chips !== 'string') { // if chipsdata is an object
      this.solutionItemsOnOverlay = this.chips;
    } else if (this.chips && typeof this.chips !== 'string') { // if chipsdata is an array
      this.chips = this.chips.filter(val => val !== null);
      this.solutionItems = this.chips.length ? this.chips : [];
      this.solutionItemsOnOverlay = this.solutionItems.length > 1 ? this.solutionItems.slice(1) : [];
    } else if (typeof this.chips === 'string') {
       this.solutionItems = this.chips ? this.chips.split(',') : [];
       this.solutionItems.forEach((key) => {
        if (key) {
          tempSolutionItem.push(key);
        }
       });
      this.solutionItems = tempSolutionItem;
       this.solutionItemsOnOverlay = this.solutionItems.length > 1 ? this.solutionItems.slice(1) : [];
    }
  }
  @Input()
  set totalChips(value: any) {
    this.solutionItems = value && value.length ? value : [];
  }
  constructor() {
    this.solutionItems = [];
  }

  ngOnInit(): void {
    // this.solutionItems = this.chips ? this.chips.split(',') : [];
    // this.solutionItemsOnOverlay = this.solutionItems.length > 1 ? this.solutionItems.slice(1) : [];

  }

}
