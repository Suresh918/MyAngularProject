import {
  LeftSidePanelState,
  NavBarPayload,
  NavBarState, RightSidePanelReviewerState,
  RightSidePanelState,
  SidePanelReviewState,
  SidePanelState
} from '../../../shared/models/mc-store.model';

export const getLeftSidePanelState = (sidePanelState: SidePanelState) => sidePanelState.leftSidePanelState;
export const getNavBarStateState = (sidePanelState: SidePanelState) => sidePanelState.navBarState;
export const getLeftNavBarState = (navBarState: NavBarState) => navBarState.leftNavBarState;
export const getRightNavBarState = (navBarState: NavBarState) => navBarState.rightNavBarState;
export const getPanelFormDirty = (navBarPayload: NavBarPayload) => navBarPayload.isPanelFormDirty;
export const getSidePanelReviewState = (leftSidePanelState: LeftSidePanelState) => leftSidePanelState.sidePanelReviewState;
export const getReviewEntryStatusChange = (sidePanelReviewState: SidePanelReviewState) => sidePanelReviewState.reviewEntryStatusChanged;
export const getReviewPayLoad = (sidePanelReviewState: SidePanelReviewState) => sidePanelReviewState.reviewPayload;
export const getCurrentReviewId = (sidePanelReviewState: SidePanelReviewState) => sidePanelReviewState.currentReviewId;

export const getRightSidePanelState = (sidePanelState: SidePanelState) => sidePanelState.rightSidePanelState;
export const getRightSidePanelReviewState = (rightSidePanelState: RightSidePanelState) => rightSidePanelState.rightSidePanelReviewState;
export const getReviewerState = (rightSidePanelState: RightSidePanelState) => rightSidePanelState.rightSidePanelReviewerState;
