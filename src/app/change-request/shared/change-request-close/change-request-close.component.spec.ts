import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ChangeRequestCloseComponent} from './change-request-close.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';



describe('ChangeRequestCloseComponent', () => {
  let component: ChangeRequestCloseComponent;
  let fixture: ComponentFixture<ChangeRequestCloseComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  const dialogMock = {
    open: () => {
    },
    close: () => {
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      declarations: [ ChangeRequestCloseComponent ],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: HelpersService, useClass: HelpersServiceMock}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestCloseComponent);
    component = fixture.componentInstance;
    component.decisionStatuses = {closureDiscussion: 'CLOSED-NOT-COMMUNICATED', closureDiscussionDetails: 'test1'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class HelpersServiceMock {
  convertToSentenceCase() {
    return {};
  }
}
