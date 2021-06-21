import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToggleFontSizeComponent } from './toggle-font-size.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';


describe('MCToggleFontSizeComponent Tests', () => {
  let component: ToggleFontSizeComponent;
  let fixture: ComponentFixture<ToggleFontSizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ToggleFontSizeComponent],
      imports: [MatButtonToggleModule, ReactiveFormsModule, BrowserModule, FlexLayoutModule]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFontSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component['changeFontSizeControl'] = new FormControl('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('control value should be updated on change', () => {
    component.changeFontSizeControl.setValue('14px');
    expect(component.changeFontSizeControl.value).toBe('14px');
  });

  it('should emit change font size event on click of button', () => {
    component.changeFontSizeControl.setValue('14px');
    spyOn(component.onChangeFontSize, 'emit');
    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('.mat-button-toggle button');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.onChangeFontSize.emit).toHaveBeenCalledWith(component.changeFontSizeControl.value);
  });
});
