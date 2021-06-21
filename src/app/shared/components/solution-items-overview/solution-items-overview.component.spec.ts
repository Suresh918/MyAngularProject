import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionItemsOverviewComponent } from './solution-items-overview.component';

describe('SolutionItemsOverviewComponent', () => {
  let component: SolutionItemsOverviewComponent;
  let fixture: ComponentFixture<SolutionItemsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionItemsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionItemsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
