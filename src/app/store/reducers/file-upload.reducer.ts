import {FileDragData, FileUploadState, LeftSidePanelState} from '../../shared/models/mc-store.model';
import * as FileUploadActionTypes from '../actions/file-upload.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: FileUploadState = {
  fileDragData: {
    'action': 'leave'
  } as FileDragData
} as FileUploadState;

const _fileUploadReducer = createReducer(initialState,
  on(FileUploadActionTypes.fileUploadDragAction, (state, actionData) => {
    return {
      ...state,
      fileDragData: {
        ...{
          'action': actionData.action,
          'dropAreaHighlighted': new Boolean(actionData.dropAreaHighlighted)
        }
      }
    };
  }));

export function fileUploadReducer(state: FileUploadState, action: Action): FileUploadState {
  return _fileUploadReducer(state, action);
}
