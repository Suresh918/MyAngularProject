import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactedItemDialogComponent } from './impacted-item-dialog.component';

describe('ImpactedItemDialogComponent', () => {
  let component: ImpactedItemDialogComponent;
  let fixture: ComponentFixture<ImpactedItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactedItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactedItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
