import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseObjectListLoaderComponent } from './case-object-list-loader.component';

describe('CaseObjectListLoaderComponent', () => {
  let component: CaseObjectListLoaderComponent;
  let fixture: ComponentFixture<CaseObjectListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
