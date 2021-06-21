import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatExpansionModule} from '@angular/material/expansion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

import {MCExpansionDraggableSectionComponent} from './mc-expansion-draggable-section.component';

describe('MCExpansionDraggableSectionComponent', () => {
  let component: MCExpansionDraggableSectionComponent;
  let fixture: ComponentFixture<MCExpansionDraggableSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCExpansionDraggableSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatExpansionModule, BrowserAnimationsModule, MatIconModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCExpansionDraggableSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
