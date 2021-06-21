import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSciaDialogComponent } from './create-scia-dialog.component';

describe('CreateSciaDialogComponent', () => {
  let component: CreateSciaDialogComponent;
  let fixture: ComponentFixture<CreateSciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSciaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
