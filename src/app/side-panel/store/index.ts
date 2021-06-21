import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {SidePanelState} from '../../shared/models/mc-store.model';
import {
  getCurrentReviewId,
  getLeftNavBarState,
  getLeftSidePanelState,
  getNavBarStateState,
  getPanelFormDirty,
  getReviewEntryStatusChange, getReviewerState,
  getReviewPayLoad,
  getRightNavBarState, getRightSidePanelReviewState, getRightSidePanelState,
  getSidePanelReviewState
} from './selectors/side-panel.selectors';
import {leftSidePanelReducer} from './reducers/left-side-panel.reducer';
import {navBarReducer} from './reducers/nav-bar.reducer';
import {rightSidePanelReducer} from './reducers/right-side-panel.reducer';

export * from './actions/left-side-panel.actions';
export * from './actions/nav-bar.actions';
export const sidePanelReducers: ActionReducerMap<SidePanelState> = {
  leftSidePanelState: leftSidePanelReducer,
  rightSidePanelState: rightSidePanelReducer,
  navBarState: navBarReducer
};

export const selectSidePanelState = createFeatureSelector('sidePanel');
export const selectLeftSidePanelState = createSelector(selectSidePanelState, getLeftSidePanelState);
export const selectNavBarState = createSelector(selectSidePanelState, getNavBarStateState);
export const selectLeftNavBarState = createSelector(selectNavBarState, getLeftNavBarState);
export const selectRightNavBarState = createSelector(selectNavBarState, getRightNavBarState);
export const selectRightPanelDirtyState = createSelector(selectRightNavBarState, getPanelFormDirty);
export const selectSidePanelReviewState = createSelector(selectLeftSidePanelState, getSidePanelReviewState);
export const selectReviewEntryStatusChange = createSelector(selectSidePanelReviewState, getReviewEntryStatusChange);
export const selectReviewPayLoad = createSelector(selectSidePanelReviewState, getReviewPayLoad);
export const selectCurrentReviewId = createSelector(selectSidePanelReviewState, getCurrentReviewId);

export const selectRightSidePanelState = createSelector(selectSidePanelState, getRightSidePanelState);
export const selectRightSidePanelReviewState = createSelector(selectRightSidePanelState, getRightSidePanelReviewState);
export const selectRightSidePanelReviewerState = createSelector(selectRightSidePanelState, getReviewerState);




