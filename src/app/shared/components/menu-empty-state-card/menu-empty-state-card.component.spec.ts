import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCMenuEmptyStateCardComponent } from './menu-empty-state-card.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('MCMenuEmptyStateCardComponent', () => {
  let component: MCMenuEmptyStateCardComponent;
  let fixture: ComponentFixture<MCMenuEmptyStateCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCMenuEmptyStateCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCMenuEmptyStateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
