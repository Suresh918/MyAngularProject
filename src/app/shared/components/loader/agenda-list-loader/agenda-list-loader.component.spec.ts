import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgendaListLoaderComponent } from './agenda-list-loader.component';

describe('AgendaListLoaderComponent', () => {
  let component: AgendaListLoaderComponent;
  let fixture: ComponentFixture<AgendaListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
