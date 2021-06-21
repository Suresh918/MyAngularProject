import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCDialogBannerComponent } from './mc-dialog-banner.component';

describe('MCDialogBannerComponent', () => {
  let component: MCDialogBannerComponent;
  let fixture: ComponentFixture<MCDialogBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCDialogBannerComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCDialogBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeBanner on triggered close',  () => {
    spyOn(component.closeBanner, 'emit');
    component.close();
    expect(component.closeBanner.emit).toHaveBeenCalled();
  });

  it('should emit actionButtonClicked on triggered emitAction',  () => {
    spyOn(component.actionButtonClicked, 'emit');
    component.emitAction();
    expect(component.actionButtonClicked.emit).toHaveBeenCalled();
  });
});
