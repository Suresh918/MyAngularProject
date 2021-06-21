import {createAction} from '@ngrx/store';
import {ReviewEntryListActionTypes} from "../../../reviews/store";

export enum ChangeRequestActionTypes {
  ChangRequestListPaginatorValueChange = '[Change Request List] Paginator Value Change',
  myTeamListValueChange = '[Change Request List] myTeam value Change'
}

export const changeRequestListPaginatorValueChange = createAction(ChangeRequestActionTypes.ChangRequestListPaginatorValueChange,
  (value: number) => ({changeRequestListPaginatorValue: value}));
export const myTeamListValue = createAction(ChangeRequestActionTypes.myTeamListValueChange,
  (value: any[]) => ({myTeamListValue: value}));
