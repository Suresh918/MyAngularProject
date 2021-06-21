import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McExpansionPanelListWorkInstructionCommentsComponent } from './mc-expansion-panel-list-work-instruction-comments.component';

describe('McExpansionPanelListWorkInstructionCommentsComponent', () => {
  let component: McExpansionPanelListWorkInstructionCommentsComponent;
  let fixture: ComponentFixture<McExpansionPanelListWorkInstructionCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McExpansionPanelListWorkInstructionCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelListWorkInstructionCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
