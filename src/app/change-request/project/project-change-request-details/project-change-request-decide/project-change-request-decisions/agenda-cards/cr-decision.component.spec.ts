import { ComponentFixture, TestBed } from '@angular/core/testing';
import {CrDecisionComponent} from './cr-decision.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {PurposeHelperService} from '../../../../../../core/utilities/purpose-helper.service';
import {AgendaItemDetail} from '../../../../../../agenda/agenda.model';



describe('CrDecisionComponent', () => {
  let component: CrDecisionComponent;
  let fixture: ComponentFixture<CrDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrDecisionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: {} },
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: PurposeHelperService, useClass: PurposeHelperServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrDecisionComponent);
    component = fixture.componentInstance;
    component.item = {
      agendaItem: {ID: '123'}
    } as AgendaItemDetail;
    component.isExpanded = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isItemExpanded flag when toggleAgendaItemView is triggered', () => {
    component.toggleAgendaItemView();
    expect(component.isItemExpanded).toBe(false);
  });

  it('should open new window,  when navigateToAgenda is clicked', () => {
    spyOn(window, 'open');
    component.navigateToAgenda('123');
    expect(window.open).toHaveBeenCalledWith('/agendas/123', '_blank');
  });
});

class PurposeHelperServiceMock {
  getStatusIcon(item) {
    return {};
  }
  getPurposeLabel(item) {
    return {};
  }
  getPurposeResultDetails(item) {
    return {};
  }
}
