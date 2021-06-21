import { MCCBCCRComponent } from './cbc-cr.component';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MatCbcComponent', () => {
  let fixture: ComponentFixture<MCCBCCRComponent>;
  let component: MCCBCCRComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MCCBCCRComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MCCBCCRComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should accept string as input and return a number', () => {
    const numberValue = component.toNumber('123');
    expect(numberValue).toEqual(123);
  });
});
