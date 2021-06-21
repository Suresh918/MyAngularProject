import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, ElementRef, Input} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatDialogNotificationComponent} from './mat-dialog-notification.component';

describe('MatDialogNotificationComponent', () => {
  let component: MatDialogNotificationComponent;
  let fixture: ComponentFixture<MatDialogNotificationComponent>;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatDialogNotificationComponent, MockInputTextStylingDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTooltipModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: AALStyleInnerHTMLDirective, useClass: MockInputTextStylingDirective}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close dismissAnnouncement triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.data = {announcement: {
        ID: '123456'
      }};
    component.dismissAnnouncement();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should open window when openURL is triggered',  () => {
    spyOn(window, 'open');
    component.data = {announcement: {
        ID: '123456',
        link: 'test.com'
      }};
    component.openURL();
    expect(window.open).toHaveBeenCalled();
  });
});

@Directive({selector: '[mcInputTextStyling]'})
class MockInputTextStylingDirective {
  @Input()
  customStyle: string;

  @Input()
  mcInputTextStyling: string;

  @Input()
  specialCharacter: any;
  constructor(private readonly el: ElementRef) {
  }
}
