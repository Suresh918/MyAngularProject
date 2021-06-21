import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SortAirPbsComponent} from './sort-air-pbs.component';



describe('SortAirPbsComponent', () => {
  let component: SortAirPbsComponent;
  let fixture: ComponentFixture<SortAirPbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortAirPbsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortAirPbsComponent);
    component = fixture.componentInstance;
    component.showItemsTooltips = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectionChangeEvent when item is dropped', () => {
    spyOn(component.selectionChangeEvent, 'emit');
    const event = {index: 1};
    component.dragElementIndex = 1;
    component.selectedAirPbsItems = [{id: 1}, {id: 2}];
    component.onDropItem(event);
    expect(component.selectionChangeEvent.emit).toHaveBeenCalled();
  });

  it('should set dragElementIndex when drag has started', () => {
    const index = 1;
    component.itemDragStarted(index);
    expect(component.dragElementIndex).toBe(1);
    expect(component.showItemsTooltips).toBe(false);
  });

  it('should set showItemsTooltips when drag has stopped', () => {
    component.onItemDragEnd();
    expect(component.showItemsTooltips).toBe(true);
  });

  it('should return projectID when itemType is pbs', () => {
    const item = {itemType: 'pbs', projectID: '12345'};
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('12345');
  });

  it('should return Owner Name when itemType is air', () => {
    const item = {itemType: 'air', projectID: '12345',
      owner: {abbreviation: 'Q04T',
        department_name: '',
        email: 'q04test@example.qas',
        full_name: 'Q 04test',
        userID: 'q04test'}
    };
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('Q 04test - Q04T');
  });

  it('should return empty when itemType is null', () => {
    const item = {itemType: null, projectID: '12345'};
    const returnValue = component.getProblemID(item);
    expect(returnValue).toBe('');
  });

  it('should return true, if itemType is pbs', () => {
    const item = {itemType: 'pbs'};
    const returnValue = component.checkForPbs(item);
    expect(returnValue).toBe(true);
  });

  it('should return true, if itemType is air', () => {
    const item = {itemType: 'air'};
    const returnValue = component.checkForAir(item);
    expect(returnValue).toBe(true);
  });
});
