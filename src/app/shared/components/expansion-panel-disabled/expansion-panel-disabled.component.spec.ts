import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelDisabledComponent } from './expansion-panel-disabled.component';

describe('ExpansionPanelDisabledComponent', () => {
  let component: ExpansionPanelDisabledComponent;
  let fixture: ComponentFixture<ExpansionPanelDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionPanelDisabledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
