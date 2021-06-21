import {LayoutState, LeftSidePanelState, ReviewPayload} from '../../../shared/models/mc-store.model';
import * as LeftSidePanelActionTypes from '../actions/left-side-panel.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: LeftSidePanelState = {
  sidePanelReviewState: {
    reviewPayload: {
      reviewStatus: '',
      caseActions: [],
      reviewEntryMandatoryFields: [],
      reviewer: null,
    } as ReviewPayload,
    currentReviewId: null,
    reviewEntryStatusChanged: new Boolean(false)
  }
} as LeftSidePanelState;

const _leftSidePanelReducer = createReducer(initialState,
  on(LeftSidePanelActionTypes.reviewStatusChange, (state, actionData) => {
    return {
      ...initialState,
      sidePanelReviewState: {...initialState.sidePanelReviewState, reviewPayload: actionData}
    };
  }),
  on(LeftSidePanelActionTypes.reviewEntryStatusChange, (state, actionData) => {
    return {
      ...state,
      sidePanelReviewState: {
        ...state.sidePanelReviewState,
        ...{reviewEntryStatusChanged: new Boolean(actionData.reviewEntryStatusChanged)}
      }
    };
  }),
  on(LeftSidePanelActionTypes.setCurrentReviewId, (state, actionData) => {
    return {
      ...state,
      sidePanelReviewState: {...state.sidePanelReviewState, currentReviewId: actionData.currentReviewId}
    };
  }));

export function leftSidePanelReducer(state: LeftSidePanelState, action: Action): LeftSidePanelState {
  return _leftSidePanelReducer(state, action);
}

