import {Action, createReducer, on} from '@ngrx/store';
import * as FieldUpdateActions from '../actions/field-update.actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {FieldUpdateData} from '../../shared/models/mc-field-update.model';
import {FieldUpdateState} from '../../shared/models/mc-store.model';

export const fieldUpdateAdapter: EntityAdapter<FieldUpdateData> = createEntityAdapter<FieldUpdateData>();

export const {
  selectAll,
  selectEntities
} = fieldUpdateAdapter.getSelectors();
// select the array of actions
export const selectAllFields = selectAll;
// select the dictionary of action entities
export const selectFieldEntities = selectEntities;

const initialState: FieldUpdateState = {
  fieldDataState: fieldUpdateAdapter.getInitialState({selectedActionId: null})
} as FieldUpdateState;

const _fieldUpdateReducer = createReducer(
  initialState,
  on(FieldUpdateActions.mcFieldUpdated, (state, actionData) => {
    /*if (actionData.serviceStatus === FieldUpdateStates.success) {
      return fieldUpdateAdapter.removeOne(actionData.fieldId + actionData.caseObject.ID + actionData.caseObject.type, state);
    }*/
    return {
      ...state,
      fieldDataState: fieldUpdateAdapter.upsertOne(actionData, state.fieldDataState)
    };
  }),
  on(FieldUpdateActions.resetFieldData, () => {
    return initialState;
  }));

export function fieldUpdateReducer(state: FieldUpdateState, action: Action): FieldUpdateState {
  return _fieldUpdateReducer(state, action);
}
