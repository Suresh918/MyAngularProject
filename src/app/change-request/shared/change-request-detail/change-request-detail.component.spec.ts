import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {ChangeRequestDetailComponent} from './change-request-detail.component';
import {ChangeRequestService} from '../../change-request.service';



describe('ChangeRequestDetailComponent', () => {
  let component: ChangeRequestDetailComponent;
  let fixture: ComponentFixture<ChangeRequestDetailComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRequestDetailComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        {provide: ChangeRequestService, useClass: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
