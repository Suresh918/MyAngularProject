import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCProblemItemsExpansionPanelComponent } from './mc-problem-items-expansion-panel.component';

describe('MCProblemItemsExpansionPanelComponent', () => {
  let component: MCProblemItemsExpansionPanelComponent;
  let fixture: ComponentFixture<MCProblemItemsExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MCProblemItemsExpansionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MCProblemItemsExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
