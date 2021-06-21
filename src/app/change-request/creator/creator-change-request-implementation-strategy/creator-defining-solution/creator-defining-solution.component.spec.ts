import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {CreatorDefiningSolutionComponent} from './creator-defining-solution.component';
import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';


describe('CreatorDefiningSolutionComponent', () => {
  let component: CreatorDefiningSolutionComponent;
  let fixture: ComponentFixture<CreatorDefiningSolutionComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorDefiningSolutionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorDefiningSolutionComponent);
    component = fixture.componentInstance;
    component.changeRequestConfiguration = {} as ChangeRequestFormConfiguration;
    component.changeRequestConfiguration['air'] = {
      help: {
        help: {
          message: 'test'
        }
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
