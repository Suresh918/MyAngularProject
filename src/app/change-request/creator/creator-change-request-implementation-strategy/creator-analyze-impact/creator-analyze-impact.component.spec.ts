import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {CreatorAnalyzeImpactComponent} from './creator-analyze-impact.component';
import {FormControl, FormGroup} from '@angular/forms';


describe('CreatorAnalyzeImpactComponent', () => {
  let component: CreatorAnalyzeImpactComponent;
  let fixture: ComponentFixture<CreatorAnalyzeImpactComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorAnalyzeImpactComponent, DurationPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {provide: AALDurationPipe, useClass: DurationPipeMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorAnalyzeImpactComponent);
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({
      impact_analysis: new FormGroup({
        implementation_ranges: new FormControl('FCO')
      })
    });
    component.getLabelAndDescription = jasmine.createSpy().and.returnValue('test');
    component.getLabel = jasmine.createSpy().and.returnValue('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set implementationRangesFCOSelected when changeRequestFormGroup is passed as an input', () => {
    const fg = component.changeRequestFormGroup; // To cover changeRequestFormGroup getter function
    expect(component.implementationRangesFCOSelected).toBe(true);
  });
});

@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}
