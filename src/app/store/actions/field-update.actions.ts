import {createAction, props} from '@ngrx/store';
import {FieldUpdateData} from '../../shared/models/mc-field-update.model';

enum MCFieldUpdateActionTypes {
  UpdateField = '[Field Update] update field status',
  ResetFieldData = '[Field Update] reset data related to field update'
}

export const mcFieldUpdated = createAction(MCFieldUpdateActionTypes.UpdateField, props<FieldUpdateData>());
export const resetFieldData = createAction(MCFieldUpdateActionTypes.ResetFieldData);
