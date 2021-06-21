import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCAutoCompleteReleasePackageComponent } from './mc-auto-complete-release-package.component';

describe('MCAutoCompleteReleasePackageComponent', () => {
  let component: MCAutoCompleteReleasePackageComponent;
  let fixture: ComponentFixture<MCAutoCompleteReleasePackageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteReleasePackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteReleasePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
