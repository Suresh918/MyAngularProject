import {ChangeRequestListState, ChangeRequestState, ReviewEntryListState} from '../../../shared/models/mc-store.model';

export const getChangeRequestListState = (state: ChangeRequestState) => state.changeRequestListState;
export const getChangeRequestListPaginatorValue = (state: ChangeRequestListState) => state.changeRequestListPaginatorValue;
export const getmyTeamList = (state: ChangeRequestListState) => state.myTeamListValue;
