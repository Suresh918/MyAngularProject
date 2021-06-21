import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AgendaActionPanelComponent} from './agenda-action-panel.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


describe('AgendaActionPanelComponent', () => {
  let component: AgendaActionPanelComponent;
  let fixture: ComponentFixture<AgendaActionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaActionPanelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatButtonToggleModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
