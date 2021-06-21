import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MCExpansionPanelComponent } from './mc-expansion-panel.component';

describe('MCExpansionPanelComponent', () => {
  let component: MCExpansionPanelComponent;
  let fixture: ComponentFixture<MCExpansionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCExpansionPanelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALExpansionPanelModule, BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit headerButtonClicked when buttonClick triggered', () => {
    spyOn(component.headerButtonClicked, 'emit');
    component.buttonClick();
    expect(component.headerButtonClicked.emit).toHaveBeenCalled();
  });
});
