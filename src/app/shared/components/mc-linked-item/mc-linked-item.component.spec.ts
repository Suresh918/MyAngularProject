import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

import {McLinkedItemComponent} from './mc-linked-item.component';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';

describe('McLinkedItemComponent', () => {
  let component: McLinkedItemComponent;
  let fixture: ComponentFixture<McLinkedItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McLinkedItemComponent, DurationPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McLinkedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}
