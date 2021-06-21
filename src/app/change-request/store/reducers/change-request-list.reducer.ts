import {ChangeRequestListState} from '../../../shared/models/mc-store.model';
import * as changeRequestActions from '../actions/change-request-list.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: ChangeRequestListState = {
  changeRequestListPaginatorValue: 8
} as ChangeRequestListState;

const _changeRequestReducer = createReducer(initialState,
  on(changeRequestActions.changeRequestListPaginatorValueChange, (state, actionData) => {
    return {
      ...state,
      changeRequestListPaginatorValue: actionData.changeRequestListPaginatorValue
    };
  }),
  on(changeRequestActions.myTeamListValue, (state, action) => {
    return {
      ...state,
      myTeamListValue: action.myTeamListValue
    };
  }));

export function changeRequestReducer(state: ChangeRequestListState, action: Action): ChangeRequestListState {
  return _changeRequestReducer(state, action);
}
