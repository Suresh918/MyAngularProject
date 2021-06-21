import {CaseActionState} from '../../shared/models/case-action.model';
import {CaseObjectState} from '../../shared/models/mc-store.model';

export const getCaseActionState = (caseObjectState: CaseObjectState) => caseObjectState.caseActionState;
export const getSelectedActionId = (caseActionState: CaseActionState) => caseActionState.selectedActionId;


export const getReadOnlyFields = (caseObjectState: CaseObjectState) => caseObjectState.caseObjectReadOnlyState;
export const getCaseObject = (caseObjectState: CaseObjectState) => caseObjectState.caseObject;
export const getCaseObjectType = (caseObjectState: CaseObjectState) => caseObjectState.caseObjectType;
export const getWriteAllowFields = (caseObjectState: CaseObjectState) => caseObjectState.caseObjectWriteAllowedState;
