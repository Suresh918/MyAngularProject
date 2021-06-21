import {createAction, props} from '@ngrx/store';
import {ParallelUpdateCaseObject} from '../../shared/models/mc-store.model';


enum ParallelUpdateActionTypes {
  UpdateCaseObject = '[Parallel Update] update data of  current case object'
}

export const updateParallelUpdateCaseObject = createAction(ParallelUpdateActionTypes.UpdateCaseObject, props<ParallelUpdateCaseObject>());

