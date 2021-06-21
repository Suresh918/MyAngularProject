import {createAction, props} from '@ngrx/store';
import {CaseObjectData} from '../../shared/models/mc.model';
import {CaseAction, CaseObjectReadOnly, CaseObjectWriteOnly} from '../../shared/models/case-action.model';

enum CaseObjectActionTypes {
  LoadCaseObject = '[Load Case Object] update case object',
  LoadCaseActions = '[Load Case Actions] update case actions',
  LoadReadOnlyParameters = '[Load Readonly Parameters] update readonly parameters',
  LoadWriteAllowParameters = '[Load Write only Parameters] update readonly parameters',
  UnloadCaseObject = '[Unload Case Object] Unload case object'
}

export const loadCaseObject = createAction(CaseObjectActionTypes.LoadCaseObject, props<CaseObjectData>());
export const loadCaseActions = createAction(CaseObjectActionTypes.LoadCaseActions, props<{ caseActions: CaseAction[] }>());
export const loadReadOnlyParameters = createAction(CaseObjectActionTypes.LoadReadOnlyParameters, props<{ readOnlyParameters: CaseObjectReadOnly[] }>());
export const loadWriteAllowParameters = createAction(CaseObjectActionTypes.LoadWriteAllowParameters, props<{ writeAllowParameters: CaseObjectWriteOnly[] }>());
export const unloadCaseObject = createAction(CaseObjectActionTypes.UnloadCaseObject);
