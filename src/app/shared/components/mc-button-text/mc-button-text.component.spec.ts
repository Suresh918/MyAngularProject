import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { MCButtonTextComponent } from './mc-button-text.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';


describe('MCButtonTextComponent', () => {
  let component: MCButtonTextComponent;
  let fixture: ComponentFixture<MCButtonTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonTextComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), AALButtonTextModule, HttpClientModule],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }
  getServiceParameter() {
    return [{ 'name': 'name1' }];
  }
}
