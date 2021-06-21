import { MCBadgeComponent } from './badge.component';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MCBadgeComponent', function () {
  let fixture: ComponentFixture<MCBadgeComponent>;
  let component: MCBadgeComponent;
  let spanEl: any;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MCBadgeComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MCBadgeComponent);
    component = fixture.componentInstance;
  }));
  it('control should display the count', () => {
    spanEl = fixture.debugElement.query(By.css('span')).nativeElement;
    component.count = 3;
    fixture.detectChanges();
    expect(spanEl.innerHTML).toContain(component.count);
  });
});
