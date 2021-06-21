import {createAction, props} from '@ngrx/store';
import {RightSidePanelReviewerState, RightSidePanelReviewState} from '../../../shared/models/mc-store.model';

export enum RightSidePanelActionTypes {
  ReviewerListUpdate = '[Side Panel] Reviewer List Update',
  UpdateReviewCaseActions = '[Side Panel] Review Case Actions'
}

export const reviewerListUpdate = createAction(RightSidePanelActionTypes.ReviewerListUpdate, props<RightSidePanelReviewState>());
export const updateReviewCaseActions = createAction(RightSidePanelActionTypes.UpdateReviewCaseActions, props<RightSidePanelReviewerState>());
