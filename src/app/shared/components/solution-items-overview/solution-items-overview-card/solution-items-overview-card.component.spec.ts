import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionItemsOverviewCardComponent } from './solution-items-overview-card.component';

describe('SolutionItemsOverviewCardComponent', () => {
  let component: SolutionItemsOverviewCardComponent;
  let fixture: ComponentFixture<SolutionItemsOverviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionItemsOverviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionItemsOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
