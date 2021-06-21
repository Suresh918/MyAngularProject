import {createAction, props} from '@ngrx/store';
import {FileDragData} from '../../shared/models/mc-store.model';

enum FileUploadActionTypes {
  FileDragInApp = '[File Upload] File drag in the application'
}

export const fileUploadDragAction = createAction(FileUploadActionTypes.FileDragInApp, props<FileDragData>());
