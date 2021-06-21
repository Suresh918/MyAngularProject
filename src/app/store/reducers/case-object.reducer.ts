import {CaseObjectState, LayoutState} from '../../shared/models/mc-store.model';
import * as CaseObjectActionTypes from '../actions/case-object.actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {CaseAction, CaseObjectReadOnly} from '../../shared/models/case-action.model';
import {Action, createReducer, on} from '@ngrx/store';

export const caseActionAdapter: EntityAdapter<CaseAction> = createEntityAdapter<CaseAction>();
export const caseObjectReadOnlyAdapter: EntityAdapter<CaseObjectReadOnly> = createEntityAdapter<CaseObjectReadOnly>();
export const caseObjectWriteAllowedAdapter: EntityAdapter<CaseObjectReadOnly> = createEntityAdapter<CaseObjectReadOnly>();

export const selectCaseActions = caseActionAdapter.getSelectors();
      export const selectAllActions = selectCaseActions.selectAll;  // select the array of actions
      export const selectActionEntities = selectCaseActions.selectEntities; // select the dictionary of action entities

export const selectReadOnlyProperties = caseObjectReadOnlyAdapter.getSelectors();
      export const selectReadOnlyEntities = selectReadOnlyProperties.selectEntities;

export const selectWriteAllowedProperties = caseObjectWriteAllowedAdapter.getSelectors();
      export const selectWriteAllowedEntities = selectWriteAllowedProperties.selectEntities;

const initialState: CaseObjectState = {
  caseObject: {},
  caseObjectType: '',
  caseActionState: caseActionAdapter.getInitialState({selectedActionId: null}),
  caseObjectReadOnlyState: caseObjectReadOnlyAdapter.getInitialState({selectedObjectId: null}),
  caseObjectWriteAllowedState: caseObjectReadOnlyAdapter.getInitialState({selectedObjectId: null}),
} as CaseObjectState;


const _caseObjectReducer = createReducer(initialState,
  on(CaseObjectActionTypes.loadCaseObject, (state, actionData) => {
    return {
      ...state,
      ...actionData
    };
  }),
  on(CaseObjectActionTypes.loadCaseActions, (state, actionData) => {
    return {
      ...state,
      caseActionState: caseActionAdapter.upsertMany(actionData.caseActions, state.caseActionState)
    };
  }),
  on(CaseObjectActionTypes.loadReadOnlyParameters, (state, actionData) => {
    return {
      ...state,
      caseObjectReadOnlyState: caseObjectReadOnlyAdapter.upsertMany(actionData.readOnlyParameters, state.caseObjectReadOnlyState)
    };
  }),
  on(CaseObjectActionTypes.loadWriteAllowParameters, (state, actionData) => {
    return {
      ...state,
      caseObjectWriteAllowedState: caseObjectWriteAllowedAdapter.upsertMany(actionData.writeAllowParameters, state.caseObjectWriteAllowedState)
    };
  }),
  on(CaseObjectActionTypes.unloadCaseObject, () => {
    return initialState;
  })
);


export function caseObjectReducer(state: CaseObjectState, action: Action): CaseObjectState {
  return _caseObjectReducer(state, action);
}

