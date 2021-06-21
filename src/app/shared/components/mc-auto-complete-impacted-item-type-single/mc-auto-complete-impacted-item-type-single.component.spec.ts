import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McAutoCompleteImpactedItemTypeSingleComponent } from './mc-auto-complete-impacted-item-type-single.component';

describe('McAutoCompleteImpactedItemTypeSingleComponent', () => {
  let component: McAutoCompleteImpactedItemTypeSingleComponent;
  let fixture: ComponentFixture<McAutoCompleteImpactedItemTypeSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McAutoCompleteImpactedItemTypeSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McAutoCompleteImpactedItemTypeSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
