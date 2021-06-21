import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCCardSummaryComponent } from './mc-card-summary.component';


describe('McUserComponent', () => {
  let component: MCCardSummaryComponent;
  let fixture: ComponentFixture<MCCardSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCardSummaryComponent ],
      imports: [AALCardSummaryModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call mainDescriptionClick & emit on trigger onRemove',  () => {
    spyOn(component.mainDescriptionClick, 'emit');
    component.onLabelClick('description');
    expect(component.mainDescriptionClick.emit).toHaveBeenCalled();
  });
});
