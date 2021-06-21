import {
  LayoutState,
  RightSidePanelReviewState,
  ReviewPayload,
  RightSidePanelState, RightSidePanelReviewerState
} from '../../../shared/models/mc-store.model';
import * as RightSidePanelActionTypes from '../actions/right-side-panel.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: RightSidePanelState = {
  rightSidePanelReviewState: {
    updateReviewerList: new Boolean(false)
  } as RightSidePanelReviewState,
  rightSidePanelReviewerState: {
    updateReviewCaseActions: new Boolean(false)
  } as RightSidePanelReviewerState
} as RightSidePanelState;

const _rightSidePanelReducer = createReducer(initialState,
  on(RightSidePanelActionTypes.reviewerListUpdate, (state, actionData) => {
    return {
      ...state,
      rightSidePanelReviewState: {
        updateReviewerList: new Boolean(actionData.updateReviewerList)
      }
    };
  }),
  on(RightSidePanelActionTypes.updateReviewCaseActions, (state, actionData) => {
  return {
    ...state,
    rightSidePanelReviewerState: {
      updateReviewCaseActions: new Boolean(actionData.updateReviewCaseActions)
    }
  };
})
)

export function rightSidePanelReducer(state: RightSidePanelState, action: Action): RightSidePanelState {
  return _rightSidePanelReducer(state, action);
}

