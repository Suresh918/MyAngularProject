import {ParallelUpdateCaseObject, ParallelUpdateState} from '../../shared/models/mc-store.model';
import * as ParallelUpdateActionTypes from '../actions/parallel-update.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: ParallelUpdateState = {
  parallelUpdateCaseObject: {
    caseAction: '',
    objectType: '',
    currentObject: {},
    saveObject: false,
    controlConfiguration: {}
  } as ParallelUpdateCaseObject
} as ParallelUpdateState;

const _parallelUpdateReducer = createReducer(initialState,
  on(ParallelUpdateActionTypes.updateParallelUpdateCaseObject, (state, actionData) => {
    return {
      ...state,
      parallelUpdateCaseObject: actionData
    };
  })
);

export function parallelUpdateReducer(state: ParallelUpdateState, action: Action): ParallelUpdateState {
  return _parallelUpdateReducer(state, action);
}

