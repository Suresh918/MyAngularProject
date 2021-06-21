import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionListLoaderComponent } from './action-list-loader.component';

describe('ActionListLoaderComponent', () => {
  let component: ActionListLoaderComponent;
  let fixture: ComponentFixture<ActionListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
