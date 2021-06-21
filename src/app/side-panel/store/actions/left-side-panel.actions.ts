import {createAction, props} from '@ngrx/store';
import {ReviewPayload} from '../../../shared/models/mc-store.model';

export enum LeftSidePanelActionTypes {
  ReviewStatusChange = '[Side Panel] Review Status Change',
  ReviewEntryStatusChange = '[Side Panel] Review Entry Status Change',
  SetCurrentReviewId = '[Side Panel] set current review id'
}

export const reviewStatusChange = createAction(LeftSidePanelActionTypes.ReviewStatusChange, props<ReviewPayload>());
export const reviewEntryStatusChange = createAction(LeftSidePanelActionTypes.ReviewEntryStatusChange, (value: boolean) => ({reviewEntryStatusChanged: value}));
export const setCurrentReviewId = createAction(LeftSidePanelActionTypes.SetCurrentReviewId, (value: number) => ({currentReviewId: value}));
