import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardGraphLoaderComponent } from './dashboard-graph-loader.component';

describe('DashboardGraphLoaderComponent', () => {
  let component: DashboardGraphLoaderComponent;
  let fixture: ComponentFixture<DashboardGraphLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGraphLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGraphLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
