import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';
import {PurposeHelperService} from '../../../../../../core/utilities/purpose-helper.service';
import {CreatorCrDecisionComponent} from './cr-decision.component';
import {AgendaItemDetail} from '../../../../../../agenda/agenda.model';


describe('CreatorCrDecisionComponent', () => {
  let component: CreatorCrDecisionComponent;
  let fixture: ComponentFixture<CreatorCrDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorCrDecisionComponent ],
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
    fixture = TestBed.createComponent(CreatorCrDecisionComponent);
    component = fixture.componentInstance;
    component.item = {} as AgendaItemDetail;
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
  it('should create', () => {
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
