import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Pipe, PipeTransform} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MCButtonOverlayCardComponent} from './mc-button-overlay-card.component';
import {PersonNamePipe} from '../../pipes/person-name.pipe';

describe('MCButtonOverlayCardComponent', () => {
  let component: MCButtonOverlayCardComponent;
  let fixture: ComponentFixture<MCButtonOverlayCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonOverlayCardComponent, DurationPipeMock, PersonNamePipeMock],
      imports: [MatIconModule, AALButtonOverlayCardModule, AALCardSummaryModule, MatTooltipModule],
      providers: [
        {provide: AALDurationPipe, useClass: DurationPipeMock},
        {provide: PersonNamePipe, useClass: PersonNamePipeMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonOverlayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit, panelOpened on trigger of openPanelcard', () => {
    spyOn(component.panelOpened, 'emit');
    component.openPanelcard();
    expect(component.panelOpened.emit).toHaveBeenCalled();
  });

  it('should emit, listItemClicked on trigger of onOverLayCardListItemClick', () => {
    spyOn(component.listItemClicked, 'emit');
    const $event = {test: 'test'};
    component.onOverLayCardListItemClick($event);
    expect(component.listItemClicked.emit).toHaveBeenCalled();
  });
});

@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}

@Pipe({name: 'personName'})
class PersonNamePipeMock implements PipeTransform {
  transform(value) {
    return 'name(abbr)';
  }
}
