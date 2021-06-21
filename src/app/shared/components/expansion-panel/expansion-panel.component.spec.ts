import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input} from '@angular/core';

import {ExpansionPanelComponent} from './expansion-panel.component';


describe('ExpansionPanelComponent', () => {
  let component: ExpansionPanelComponent;
  let fixture: ComponentFixture<ExpansionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpansionPanelComponent, MockAALChangeFontSizeDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: AALChangeFontSizeDirective, useClass: MockAALChangeFontSizeDirective}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Directive({selector: '[aalChangeFontSize]'})
class MockAALChangeFontSizeDirective {
  size: string;
  @Input()
  isLabel: string;
  constructor () {
  }
  get fontSize(): string {
    return this.size;
  }

  @Input()
  set fontSize(fontSize: string) {
    this.size = fontSize;
  }
}
