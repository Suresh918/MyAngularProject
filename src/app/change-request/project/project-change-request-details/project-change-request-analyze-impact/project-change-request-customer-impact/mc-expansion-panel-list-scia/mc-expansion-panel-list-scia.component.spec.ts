import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McExpansionPanelListSciaComponent } from './mc-expansion-panel-list-scia.component';

describe('McExpansionPanelListSciaComponent', () => {
  let component: McExpansionPanelListSciaComponent;
  let fixture: ComponentFixture<McExpansionPanelListSciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McExpansionPanelListSciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelListSciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
