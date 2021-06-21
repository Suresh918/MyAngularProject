import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {ChangeRequestState} from '../../shared/models/mc-store.model';
import {changeRequestReducer} from './reducers/change-request-list.reducer';
import {
  getChangeRequestListPaginatorValue,
  getChangeRequestListState,
  getmyTeamList
} from './selectors/change-request-list.selectors';

export * from './actions/change-request-list.actions';

export const changeRequestReducers: ActionReducerMap<ChangeRequestState> = {
  changeRequestListState: changeRequestReducer
};

export const selectChangeRequests = createFeatureSelector<ChangeRequestState>('changeRequest');
export const selectChangeRequestListState = createSelector(selectChangeRequests, getChangeRequestListState);
export const selectChangeRequestListPaginatorValue = createSelector(selectChangeRequestListState, getChangeRequestListPaginatorValue);
export const selectMyTeamListValue = createSelector(selectChangeRequestListState, getmyTeamList);
