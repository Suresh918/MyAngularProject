import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatInputTextMultiChipComponent } from './mat-input-text-multi-chip.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';

describe('MatInputTextMultiChipComponent', () => {
  let component: MatInputTextMultiChipComponent;
  let fixture: ComponentFixture<MatInputTextMultiChipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatInputTextMultiChipComponent ],
      imports: [MatChipsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatInputTextMultiChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
