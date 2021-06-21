import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Directive, Input, Pipe, PipeTransform} from '@angular/core';

import { MCCurrencyFieldComponent } from './mc-currency-field.component';

describe('MCCurrencyFieldComponent', () => {
  let component: MCCurrencyFieldComponent;
  let fixture: ComponentFixture<MCCurrencyFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCurrencyFieldComponent, MockAALChangeFontSizeDirective, AALReplacePipeMock ],
      imports: [AALInputCurrencyModule],
      providers: [{provide: AALChangeFontSizeDirective, useClass: MockAALChangeFontSizeDirective},
        {provide: AALReplacePipe, useClass: AALReplacePipeMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCurrencyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return data when string value is given as parameter for toNumber', () => {
    const returnValue = component.toNumber('123');
    expect(returnValue).toBe(123);
  });

  it('should return default string fraction value format when getDisplayFormat is triggered', () => {
    const returnValue = component.getDisplayFormat();
    expect(returnValue).toBe('1.0-0');
  });
});
@Directive({selector: '[aalChangeFontSize]'})
class MockAALChangeFontSizeDirective {
  size: string;
  @Input()
  isLabel: string;
  constructor () {
  }
  get fontSize(): string {
    return this.size;
  }

  @Input()
  set fontSize(fontSize: string) {
    this.size = fontSize;
  }
}

@Pipe({name: 'aalReplace'})
class AALReplacePipeMock implements PipeTransform {
  transform(value, newValue) {
    return 'xyz';
  }
}
