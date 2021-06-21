import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidePanelRightComponent} from './side-panel-right/side-panel-right.component';
import {SidePanelRightActionsComponent} from './side-panel-right/side-panel-right-actions/side-panel-right-actions.component';
import {SidePanelRightNotesComponent} from './side-panel-right/side-panel-right-notes/side-panel-right-notes.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {sidePanelReducers} from './store';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DndModule} from 'ngx-drag-drop';
import {RightPanelHeaderComponent} from './side-panel-right/right-panel-header/right-panel-header.component';
import {NoteCardComponent} from './side-panel-right/side-panel-right-notes/note-card/note-card.component';
import {SidePanelRightAttachmentsComponent} from './side-panel-right/side-panel-right-attachments/side-panel-right-attachments.component';
import {AttachmentCardComponent} from './side-panel-right/side-panel-right-attachments/attachment-card/attachment-card.component';
import {ActionOverviewCardComponent} from './side-panel-right/side-panel-right-actions/action-overview-card/action-overview-card.component';
import {SidePanelRightDocumentsComponent} from './side-panel-right/side-panel-right-documents/side-panel-right-documents.component';
import {NoActionsComponent} from './side-panel-right/side-panel-right-actions/no-actions/no-actions.component';
import {AddActionComponent} from './side-panel-right/side-panel-right-actions/add-action/add-action.component';
import {DocumentDeleteDialogComponent} from './side-panel-right/side-panel-right-documents/document-delete-dialog/document-delete-dialog-component';
import {RightPanelAddObjectComponent} from './side-panel-right/right-panel-add-object/right-panel-add-object.component';
import {SidePanelRightAttendeesComponent} from './side-panel-right/side-panel-right-attendees/side-panel-right-attendees.component';
import { SidePanelRightReviewsComponent } from './side-panel-right/side-panel-right-reviews/side-panel-right-reviews.component';
import { AddReviewerComponent } from './side-panel-right/side-panel-right-reviews/add-reviewer/add-reviewer.component';
import { ReviewerOverviewCardComponent } from './side-panel-right/side-panel-right-reviews/reviewer-overview-card/reviewer-overview-card.component';
import { EditReviewerDialogComponent } from './side-panel-right/side-panel-right-reviews/edit-reviewer-dialog/edit-reviewer-dialog.component';
import {SidePanelService} from './side-panel.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DndModule,
    DragDropModule,
    StoreModule.forFeature('sidePanel', sidePanelReducers),
    // AALCommonModule,
  ],
  declarations: [
    SidePanelRightComponent,
    SidePanelRightActionsComponent,
    SidePanelRightNotesComponent,
    RightPanelHeaderComponent,
    NoteCardComponent,
    SidePanelRightAttachmentsComponent,
    AttachmentCardComponent,
    SidePanelRightDocumentsComponent,
    ActionOverviewCardComponent,
    NoActionsComponent,
    AddActionComponent,
    DocumentDeleteDialogComponent,
    RightPanelAddObjectComponent,
    SidePanelRightAttendeesComponent,
    SidePanelRightReviewsComponent,
    AddReviewerComponent,
    ReviewerOverviewCardComponent,
    EditReviewerDialogComponent],
  exports: [SidePanelRightComponent],
  entryComponents: [],
  providers: [SidePanelService]
})
export class SidePanelModule {
}
