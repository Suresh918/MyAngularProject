import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecisionLoaderComponent } from './decision-loader.component';

describe('DecisionLoaderComponent', () => {
  let component: DecisionLoaderComponent;
  let fixture: ComponentFixture<DecisionLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
