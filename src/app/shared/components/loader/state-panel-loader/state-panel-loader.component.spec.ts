import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatePanelLoaderComponent } from './state-panel-loader.component';

describe('StatePanelLoaderComponent', () => {
  let component: StatePanelLoaderComponent;
  let fixture: ComponentFixture<StatePanelLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatePanelLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatePanelLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
