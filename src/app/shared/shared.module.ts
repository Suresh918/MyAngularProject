/**
 * @file  shared.module.ts
 *@description This file is used to add all common shared modules used in the app and that has to be shared across the app
 *
 * */
// import angular and 3rd party components
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {DndModule as NgxDndModule} from 'ngx-drag-drop';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {StoreModule} from '@ngrx/store';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DateAdapter, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
// importing local angular components
import {MultiUserSearchComponent} from './components/mat-input-multi-user-search/mat-input-multi-user-search.component';
import {ObjectComponent} from './components/object/object.component';
import {CheckItemPipe} from './pipes/check-item.pipe';
import {FooterComponent} from '../main/footer/footer.component';
import {MatInputTextComponent} from './components/mat-input-text/mat-input-text.component';
import {MatDatePickerComponent} from './components/mat-date-picker/mat-date-picker.component';
import {MCBadgeComponent} from './components/badge/badge.component';
import {MatDialogDeleteConfirmationComponent} from './components/mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {UserImagePipe} from './pipes/user-profile-img.pipe';
import {MCCbcComponent} from './components/cbc/cbc.component';
import {UserRoleTransformPipe} from './pipes/user-role-trasform.pipe';
import {MatInputTextAreaComponent} from './components/mat-input-text-area/mat-input-text-area.component';
import {MatSelectComponent} from './components/mat-select/mat-select.component';
import {BsnlDateAdapter} from '../core/utilities/bsnl-date-adapter';
import {TitleBarComponent} from './components/title-bar/title-bar.component';
import {FilterBarComponent} from './components/filter-bar/filter-bar.component';
import {FilterBarSelectedOptionsContainerComponent} from './components/filter-bar/filter-bar-selected-options-container/filter-bar-selected-options-container.component';
import {FilterPanelComponent} from './components/filter-bar/filter-panel/filter-panel.component';
import {FilterBarSearchComponent} from './components/filter-bar/filter-bar-search/filter-bar-search.component';
import {MatDialogFilterGroupDeleteComponent} from './components/filter-bar/quick-filter-panel/mat-dialog-filter-group-delete/mat-dialog-filter-group-delete.component';
import {MatDialogNavigationConfirmationComponent} from './components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {MCAddNotesComponent} from './components/add-notes/add-notes.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ObjectLinkComponent} from './components/object-link/object-link.component';
import {ChangeUserRoleLabelsPipe} from './pipes/change-user-role-labels.pipe';
import {errorStoreReducers} from './store';
import {LowSeveritySnackBarComponent} from './components/low-severity-snack-bar/low-severity-snack-bar.component';
import {MatDialogObsoleteConfirmationComponent} from './components/mat-dialog-obsolete-confirmation/mat-dialog-obsolete-confirmation.component';
import {MCMyTeamQuickCardComponent} from './components/mc-my-team-quick-card/mc-my-team-quick-card.component';
import {MatDialogInputUserSearchComponent} from './components/mat-dialog-input-user-search/mat-dialog-input-user-search.component';
import {MCMenuEmptyStateCardComponent} from './components/menu-empty-state-card/menu-empty-state-card.component';
import {MatDialogNotificationComponent} from './components/mat-dialog-notification/mat-dialog-notification.component';
import {MatDatePickerCustomizedComponent} from './components/mat-date-picker-customized/mat-date-picker-customized.component';
import {MatNotificationSnackBarComponent} from './components/mat-notification-snack-bar/mat-notification-snack-bar.component';
import {MCCaseObjectListComponent} from './components/case-object-list/case-object-list.component';
import {MCLinkedItemsPanelComponent} from './components/mc-linked-items-panel/mc-linked-items-panel.component';
import {CaseObjectTableComponent} from './components/case-object-list/case-object-table/case-object-table.component';
import {MCCaseObjectCardListComponent} from './components/case-object-list/case-object-overview-list/case-object-card-list.component';
import {CaseObjectOverviewCardComponent} from './components/case-object-list/case-object-overview-list/case-object-overview-card/case-object-overview-card.component';
import {CaseObjectStatusCardComponent} from './components/case-object-list/case-object-state-panel/case-object-status-card/case-object-status-card.component';
import {CaseObjectStatePanelComponent} from './components/case-object-list/case-object-state-panel/case-object-state-panel.component';
import {ActionPanelComponent} from './components/action-panel/action-panel.component';
import {CaseObjectDetailsHeaderComponent} from './components/case-object-details-header/case-object-details-header.component';
import {QuickFilterPanelComponent} from './components/filter-bar/quick-filter-panel/quick-filter-panel.component';
import {FilterPeoplePanelComponent} from './components/filter-bar/filter-panel/filter-people-panel/filter-people-panel.component';
import {MatDialogImportQuickFilterComponent} from './components/filter-bar/quick-filter-panel/mat-dialog-import-quick-filter/mat-dialog-import-quick-filter.component';
import {FilterChangeDetailsPanelComponent} from './components/filter-bar/filter-panel/filter-change-details-panel/filter-change-details-panel.component';
import {FilterUrgencyPanelComponent} from './components/filter-bar/filter-panel/filter-urgency-panel/filter-urgency-panel.component';
import {StatusCheckerPipe} from './pipes/status-checker.pipe';
import {GlobalSearchComponent} from './components/global-search/global-search.component';
import {MatInputTextMultiChipComponent} from './components/mat-input-text-multi-chip/mat-input-text-multi-chip.component';
import {CaseObjectLabelPipe} from './pipes/case-object-label.pipe';
import {ExpansionPanelComponent} from './components/expansion-panel/expansion-panel.component';
import {ToggleFontSizeComponent} from './components/toggle-font-size/toggle-font-size.component';
import {ActionPanelListComponent} from './components/action-panel/action-panel-list/action-panel-list.component';
import {ReleasePackageActionContentComponent} from './components/action-panel/release-package-action-content/release-package-action-content.component';
import {AgendaActionPanelComponent} from './components/action-panel/agenda-action-panel/agenda-action-panel.component';
import {ActionPanelHeaderComponent} from './components/action-panel/action-panel-header/action-panel-header.component';
import {PriorityTransformPipe} from './pipes/priority-transform.pipe';
import {SidePanelRightMenuComponent} from '../main/body/right-side-panel-menu/side-panel-right-menu.component';
import {ActionPanelIconComponent} from './components/action-panel/action-panel-icon/action-panel-icon.component';
import {HistoryQuickCardComponent} from './components/history-quick-card/history-quick-card.component';
import {AgendaRuleSetComponent} from '../admin/agenda-rule-set/agenda-rule-set.component';
import {MCSelectSingleComponent} from './components/mc-select-single/mc-select-single.component';
import {MCInputTextComponent} from './components/mc-input-text/mc-input-text.component';
import {MCInputTextListComponent} from './components/mc-input-text-list/mc-input-text-list.component';
import {MCSelectMultipleComponent} from './components/mc-select-multiple/mc-select-multiple.component';
import {MCFieldComponent} from './components/mc-field/mc-field.component';
import {MCInputTextAreaComponent} from './components/mc-input-text-area/mc-input-text-area.component';
import {MCInputLinkComponent} from './components/mc-input-link/mc-input-link.component';
import {MCInputTimeComponent} from './components/mc-input-time/mc-input-time.component';
import {MCInputDurationComponent} from './components/mc-input-duration/mc-input-duration.component';
import {MCInputCurrencyComponent} from './components/mc-input-currency/mc-input-currency.component';
import {MCInputNumberComponent} from './components/mc-input-number/mc-input-number.component';
import {MCButtonToggleComponent} from './components/mc-button-toggle/mc-button-toggle.component';
import {MCButtonRadioComponent} from './components/mc-button-radio/mc-button-radio.component';
import {MCSelectSingleInputComponent} from './components/mc-select-single-input/mc-select-single-input.component';
import {MCSelectMultipleInputComponent} from './components/mc-select-multiple-input/mc-select-multiple-input.component';
import {MCButtonToggleInputComponent} from './components/mc-button-toggle-input/mc-button-toggle-input.component';
import {MCRichTextAreaComponent} from './components/mc-rich-text-area/mc-rich-text-area.component';
import {MCFieldCompositeComponent} from './components/mc-field-composite/mc-field-composite.component';
import {MCToolbarFieldComponent} from './components/mc-toolbar/mc-toolbar-field.component';
import {MCToolbarComponent} from './components/mc-toolbar/mc-toolbar/mc-toolbar.component';
import {MCDatePickerComponent} from './components/mc-date-picker/mc-date-picker.component';
import {MCDatePickerSelectComponent} from './components/mc-date-picker-select/mc-date-picker-select.component';
import {MCDatePickerRangeComponent} from './components/mc-date-picker-range/mc-date-picker-range.component';
import {MCExpansionPanelComponent} from './components/mc-expansion-panel/mc-expansion-panel.component';
import {MCAutoCompleteUserSingleComponent} from './components/mc-auto-complete-user-single/mc-auto-complete-user-single.component';
import {MCAutoCompleteProductSingleComponent} from './components/mc-auto-complete-product-single/mc-auto-complete-product-single.component';
import {MCAutoCompleteProjectSingleComponent} from './components/mc-auto-complete-project-single/mc-auto-complete-project-single.component';
import {MCAutoCompleteFunctionalClusterSingleComponent} from './components/mc-auto-complete-functional-cluster-single/mc-auto-complete-functional-cluster-single.component';
import {MCAutoCompleteGroupMultipleComponent} from './components/mc-auto-complete-group-multiple/mc-auto-complete-group-multiple.component';
import {MCSelectSingleCaseActionComponent} from './components/mc-select-single-case-action/mc-select-single-case-action.component';
import {MCFieldCaseActionComponent} from './components/mc-field-case-action/mc-field-case-action.component';
import {MCHelpComponent} from './components/mc-help/mc-help.component';
import {MatDialogChangeActionTitleComponent} from './components/mat-dialog-change-action-title/mat-dialog-change-action-title.component';
import {MCAlertComponent} from './components/mc-alert/mc-alert.component';
import {MCExpansionPanelListDocumentComponent} from './components/mc-expansion-panel-list-document/mc-expansion-panel-list-document.component';
import {MCExpansionPanelListReviewComponent} from '../release-package/release-package-details/mc-expansion-panel-list-review/mc-expansion-panel-list-review.component';
import {MCExpansionPanelListMeetingsComponent} from './components/mc-expansion-panel-list-meetings/mc-expansion-panel-list-meetings.component';
import {MCButtonComponent} from './components/mc-button/mc-button.component';
import {MCButtonContainedComponent} from './components/mc-button-contained/mc-button-contained.component';
import {MCButtonOutlinedComponent} from './components/mc-button-outlined/mc-button-outlined.component';
import {MCButtonIconComponent} from './components/mc-button-icon/mc-button-icon.component';
import {MCButtonTextComponent} from './components/mc-button-text/mc-button-text.component';
import {CaseObjectOverviewListPanelComponent} from './components/case-object-overview-list-panel/case-object-overview-list-panel.component';
import {McAssessmentWizardPiiaModule} from './components/mc-assessment-wizard-piia/mc-assessment-wizard-piia.module';
import {MCAssessmentWizardCIAModule} from './components/mc-assessment-wizard-cia/mc-assessment-wizard-cia.module';
import {MCButtonIconOutlinedComponent} from './components/mc-button-icon-outlined/mc-button-icon-outlined.component';
import {MCButtonDynamicComponent} from './components/mc-button-dynamic/mc-button-dynamic.component';
import {MCCardSummaryComponent} from './components/mc-card-summary/mc-card-summary.component';
import {MCButtonOverlayTabbedComponent} from './components/mc-button-overlay-tabbed/mc-button-overlay-tabbed.component';
import {MCTextComponent} from './components/mc-text/mc-text.component';
import {McTabHeaderBarComponent} from './components/mc-tab-header-bar/mc-tab-header-bar.component';
import {MCButtonOverlayCardComponent} from './components/mc-button-overlay-card/mc-button-overlay-card.component';
import {MCMenuSortComponent} from './components/mc-menu-sort/mc-menu-sort.component';
import {MCExpansionDraggableSectionComponent} from './components/mc-expansion-draggable-section/mc-expansion-draggable-section.component';
import {McInputTextSuffixComponent} from './components/mc-input-text-suffix/mc-input-text-suffix.component';
import {MCAutoCompleteUserMultipleComponent} from './components/mc-auto-complete-user-multiple/mc-auto-complete-user-multiple.component';
import {McExpansionPanelListAirComponent} from './components/mc-expansion-panel-list-air/mc-expansion-panel-list-air.component';
import {MCAirPbsExpansionPanelListComponent} from './components/mc-air-pbs-expansion-panel-list/mc-air-pbs-expansion-panel-list.component';
import {McExpansionPanelListPbsComponent} from './components/mc-expansion-panel-list-pbs/mc-expansion-panel-list-pbs.component';
import {MCListItemComponent} from './components/mc-list-item/mc-list-item.component';
import {MCButtonIconContainedComponent} from './components/mc-button-icon-contained/mc-button-icon-contained.component';
import {MCInputDurationAgendaItemComponent} from './components/mc-input-duration-agenda-item/mc-input-duration-agenda-item.component';
import {McAutoCompleteUserSingleCardComponent} from './components/mc-auto-complete-user-single-card/mc-auto-complete-user-single-card.component';
import {AgendaOverviewCardComponent} from './components/agenda-overview-card/agenda-overview-card.component';
import {PersonNamePipe} from './pipes/person-name.pipe';
import {MCAutoCompleteProjectLeadComponent} from './components/mc-auto-complete-project-lead/mc-auto-complete-project-lead.component';
import {MCChipComponent} from './components/mc-chip/mc-chip.component';
import {MCDiaComponent} from './components/mc-dia/mc-dia.component';
import {McLinkedItemComponent} from './components/mc-linked-item/mc-linked-item.component';
import {MCDialogBannerComponent} from './components/mc-dialog-banner/mc-dialog-banner.component';
import {McCbRulesComponent} from './components/mc-cb-rules/mc-cb-rules.component';
import {MCAddCbMeetingDialogComponent} from './components/mc-add-cb-meeting-dialog/mc-add-cb-meeting-dialog.component';
import {MCOverviewConfigurableCardComponent} from './components/mc-overview-configurable-card/mc-overview-configurable-card.component';
import {McButtonToggleInputStatusAiComponent} from './components/mc-button-toggle-input-status-ai/mc-button-toggle-input-status-ai.component';
import {MCAgendaListOverlayCardComponent} from './components/mc-agenda-list-overlay-card/mc-agenda-list-overlay-card.component';
import {MCAutoCompleteGroupSingleComponent} from './components/mc-auto-complete-group-single/mc-auto-complete-group-single.component';
import {MCButtonImsComponent} from './components/mc-button-ims/mc-button-ims.component';
import {MCCurrencyFieldComponent} from './components/mc-currency-field/mc-currency-field.component';
import {CaseObjectActionStatusCardComponent} from './components/case-object-list/case-object-state-panel/case-object-action-status-card/case-object-action-status-card.component';
import {MCButtonRadioInputComponent} from './components/mc-button-radio-input/mc-button-radio-input.component';
import {MCUserActionsTabbedComponent} from './components/mc-user-actions-tabbed/mc-user-actions-tabbed.component';
import {MCAutoCompleteProjectMultipleComponent} from './components/mc-auto-complete-project-multiple/mc-auto-complete-project-multiple.component';
import {MCAutoCompleteProductMultipleComponent} from './components/mc-auto-complete-product-multiple/mc-auto-complete-product-multiple.component';
import {MCAutoCompleteAirMultipleComponent} from './components/mc-auto-complete-air-multiple/mc-auto-complete-air-multiple.component';
import {MCAutoCompletePbsMultipleComponent} from './components/mc-auto-complete-pbs-multiple/mc-auto-complete-pbs-multiple.component';
import {AddItemsContainerComponent} from './components/add-items-container/add-items-container.component';
import {MCAutoCompleteReleasePackageComponent} from './components/mc-auto-complete-release-package/mc-auto-complete-release-package.component';
import {MCCaseObjectOptionsComponent} from './components/mc-case-object-options/mc-case-object-options.component';
import {NotificationTypeCardComponent} from './components/case-object-list/notification-type-panel/notification-type-card/notification-type-card.component';
import {NotificationTypePanelComponent} from './components/case-object-list/notification-type-panel/notification-type-panel.component';
import {MCAnalyticsPanelComponent} from './components/mc-analytics-panel/mc-analytics-panel.component';
import {LoaderComponent} from './components/loader/loader.component';
import { MCEmptyStateComponent } from './components/mc-empty-state/mc-empty-state.component';
import { MCButtonOverlayIconComponent } from './components/mc-button-overlay-icon/mc-button-overlay-icon.component';
import { DecisionLoaderComponent } from './components/loader/decision-loader/decision-loader.component';
import { DashboardGraphLoaderComponent } from './components/loader/dashboard-graph-loader/dashboard-graph-loader.component';
import {FileUploadFormComponent} from '../side-panel/side-panel-right/file-upload-form/file-upload-form.component';
import { MCAutoCompleteProductsAffectedMultipleComponent } from './components/mc-auto-complete-products-affected-multiple/mc-auto-complete-products-affected-multiple.component';
import { CaseObjectListLoaderComponent } from './components/loader/case-object-list-loader/case-object-list-loader.component';
import { StatePanelLoaderComponent } from './components/loader/state-panel-loader/state-panel-loader.component';
import { ActionListLoaderComponent } from './components/loader/action-list-loader/action-list-loader.component';
import { NotificationListLoaderComponent } from './components/loader/notification-list-loader/notification-list-loader.component';
import { AgendaListLoaderComponent } from './components/loader/agenda-list-loader/agenda-list-loader.component';
import { MCConversationDialogComponent } from './components/mc-conversation-dialog/mc-conversation-dialog.component';
import { MessageCardComponent } from './components/mc-conversation-dialog/message-card/message-card.component';
import { OverlayLoaderComponent } from './components/loader/overlay-loader/overlay-loader.component';
import { UsersIconFilterComponent } from './components/users-icon-filter/users-icon-filter.component';
import { ReviewEntryListLoaderComponent } from './components/loader/review-entry-list-loader/review-entry-list-loader.component';
import {SidePanelRightMenuLoaderComponent} from './components/loader/side-panel-right-menu-loader/side-panel-right-menu-loader.component';
import { ReviewListLoaderComponent } from './components/loader/review-list-loader/review-list-loader.component';
import { McDividerComponent } from './components/mc-divider/mc-divider.component';
import {CommentReplyComponent} from './components/loader/comment-reply/comment-reply.component';
import { McChipOverlayCardComponent } from './components/mc-chip-overlay-card/mc-chip-overlay-card.component';
import {MatMultiAssigneeGroupsComponent} from './components/mat-input-multi-user-search/multiple-assignees-dialog/mat-multi-assignee-groups/mat-multi-assignee-groups.component';
import { MCCaseObjectOverviewComponent } from './components/case-object-overview/case-object-overview.component';
import { CaseObjectAnalyticsPanelComponent } from './components/case-object-overview/case-object-analytics-panel/case-object-analytics-panel.component';
import { MCCaseObjectOverviewCardListComponent } from './components/case-object-overview/case-object-overview-card-list/case-object-overview-card-list.component';
import { MCCaseObjectOverviewCardItemComponent } from './components/case-object-overview/case-object-overview-card-list/case-object-overview-card-item/case-object-overview-card-item.component';
import { MCCaseObjectOverviewTableComponent } from './components/case-object-overview/case-object-overview-table/case-object-overview-table.component';
import { MCAssessmentDialogPIIAComponent } from './components/mc-assessment-dialog-piia/mc-assessment-dialog-piia.component';
import {MCCBCCRComponent} from './components/cbc-cr/cbc-cr.component';
import { FilterMyTeamManagementPanelComponent } from './components/filter-bar/filter-panel/filter-my-team-management-panel/filter-my-team-management-panel.component';
import { CaseObjectOverviewCardListPanelComponent } from './components/case-object-overview/case-object-overview-card-list-panel/case-object-overview-card-list-panel.component';
import { SolutionItemsOverviewComponent } from './components/solution-items-overview/solution-items-overview.component';
import { SolutionItemsOverviewCardComponent } from './components/solution-items-overview/solution-items-overview-card/solution-items-overview-card.component';
import { ImpactedItemDialogComponent } from './components/impacted-item-dialog/impacted-item-dialog.component';
import { McAutoCompleteImpactedItemTypeSingleComponent } from './components/mc-auto-complete-impacted-item-type-single/mc-auto-complete-impacted-item-type-single.component';
import { McExpansionPanelListWorkInstructionCommentsComponent } from './components/mc-expansion-panel-list-work-instruction-comments/mc-expansion-panel-list-work-instruction-comments.component';
import { SwitchOwnerConfirmationDialogComponent } from './components/switch-owner-confirmation-dialog/switch-owner-confirmation-dialog.component';
import { ReviewDetailsTableComponent } from './components/loader/review-details-table/review-details-table.component';
import { ExpansionPanelDisabledComponent } from './components/expansion-panel-disabled/expansion-panel-disabled.component';
import { MCProblemItemsExpansionPanelComponent } from './components/mc-problem-items-expansion-panel/mc-problem-items-expansion-panel.component';
import { MCAutoCompletePlmpcSingleComponent } from './components/mc-auto-complete-plmpc-single/mc-auto-complete-plmpc-single.component';
import {ContextIdTransformPipe} from './pipes/context-id-transform.pipe';


@NgModule({
  imports: [
    NgxDndModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatBadgeModule,
    RouterModule,
    MatExpansionModule,
    StoreModule.forFeature('errorStore', errorStoreReducers),
    NgxChartsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    InfiniteScrollModule,
    MatCardModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatTabsModule,
    DragDropModule,
    /*AALSelectSingleModule,
    AALInputTextModule,
    AALSelectMultipleModule,
    AALInputTextAreaModule,
    AALInputLinkModule,
    AALInputTimeModule,
    AALInputDurationModule,
    AALInputCurrencyModule,
    AALInputNumberModule,
    AALButtonRadioModule,
    AALButtonRadioInputModule,
    AALButtonToggleModule,
    AALSelectSingleInputModule,
    AALSelectMultipleInputModule,
    AALButtonToggleInputModule,
    AALRichTextAreaModule,
    AALDatePickerModule,
    AALDatePickerSelectModule,
    AALDatePickerRangeModule,
    AALRichTextAreaModule,
    AALExpansionPanelModule,
    AALRichTextAreaModule,
    AALAutoCompleteSingleModule,
    AALAutoCompleteMultipleModule,
    AutoCompleteFreeTextMultipleModule,
    AALLightBoxModule,
    AALOverlayCardHelpModule,
    AALOverlayCardErrorModule,
    AALExpansionPanelListModule,
    AALExpansionPanelOverviewCardListModule,
    AALButtonContainedModule,
    AALButtonOutlinedModule,
    AALButtonIconModule,
    AALButtonTextModule,
    AALWizardAssessmentDialogModule,
    AALWizardAssessmentModule,
    AALExpansionPanelOverviewCardListModule,*/
    McAssessmentWizardPiiaModule,
    MCAssessmentWizardCIAModule,
    /*AALButtonIconOutlinedModule,
    AALButtonDynamicModule,
    AALCardSummaryModule,
    AALButtonOverlayTabbedModule,
    AALButtonOverlayCardModule,
    AALButtonOverlayIconModule,
    AALMenuSortModule,
    AALTextFieldModule,
    AALInputTextSuffixModule,
    AALListItemModule,
    AALButtonIconContainedModule,
    AALAutoCompleteSingleCardModule,
    AALLightBoxMultipleModule,
*/    MatRadioModule,
  /*  AALChipModule,
    AALCommonModule,
    AALEditableDivTextAreaModule,
    AALAnalyticsPanelModule,
*/    NgxSkeletonLoaderModule,
  //  AALEmptyStateModule
  ],
  declarations: [
    MultiUserSearchComponent,
    ObjectComponent,
    ObjectLinkComponent,
    CheckItemPipe,
    UserRoleTransformPipe,
    FooterComponent,
    MatInputTextComponent,
    MatInputTextAreaComponent,
    MatSelectComponent,
    MatDatePickerComponent,
    MCBadgeComponent,
    MatDialogDeleteConfirmationComponent,
    MCAddNotesComponent,
    PriorityTransformPipe,
    ContextIdTransformPipe,
    UserImagePipe,
    MCCbcComponent,
    MCCBCCRComponent,
    TitleBarComponent,
    FilterBarComponent,
    FilterBarSelectedOptionsContainerComponent,
    FilterPanelComponent,
    FilterBarSearchComponent,
    MatDialogFilterGroupDeleteComponent,
    MatDialogNavigationConfirmationComponent,
    PageNotFoundComponent,
    ChangeUserRoleLabelsPipe,
    LowSeveritySnackBarComponent,
    MatDialogObsoleteConfirmationComponent,
    MCMyTeamQuickCardComponent,
    MatDialogInputUserSearchComponent,
    MCMenuEmptyStateCardComponent,
    MatDialogNotificationComponent,
    MatDatePickerCustomizedComponent,
    MatNotificationSnackBarComponent,
    CaseObjectStatusCardComponent,
    CaseObjectOverviewCardComponent,
    MCCaseObjectListComponent,
    CaseObjectStatePanelComponent,
    MCLinkedItemsPanelComponent,
    CaseObjectTableComponent,
    MCCaseObjectCardListComponent,
    ActionPanelComponent,
    CaseObjectDetailsHeaderComponent,
    AddItemsContainerComponent,
    QuickFilterPanelComponent,
    FilterPeoplePanelComponent,
    MatDialogImportQuickFilterComponent,
    FilterChangeDetailsPanelComponent,
    FilterUrgencyPanelComponent,
    StatusCheckerPipe,
    GlobalSearchComponent,
    MatInputTextMultiChipComponent,
    CaseObjectLabelPipe,
    ExpansionPanelComponent,
    ToggleFontSizeComponent,
    ActionPanelListComponent,
    ReleasePackageActionContentComponent,
    AgendaActionPanelComponent,
    ActionPanelHeaderComponent,
    SidePanelRightMenuComponent,
    ActionPanelIconComponent,
    ActionPanelIconComponent,
    HistoryQuickCardComponent,
    AgendaRuleSetComponent,
    MCSelectSingleComponent,
    MCInputTextComponent,
    MCInputTextListComponent,
    MCSelectMultipleComponent,
    MCFieldComponent,
    MCInputTextAreaComponent,
    MCInputLinkComponent,
    MCInputTimeComponent,
    MCInputDurationComponent,
    MCInputCurrencyComponent,
    MCInputNumberComponent,
    MCButtonToggleComponent,
    MCButtonRadioComponent,
    MCSelectSingleInputComponent,
    MCSelectMultipleInputComponent,
    MCButtonToggleInputComponent,
    MCRichTextAreaComponent,
    MCFieldCompositeComponent,
    MCToolbarFieldComponent,
    MCToolbarComponent,
    MCDatePickerComponent,
    MCDatePickerSelectComponent,
    MCDatePickerRangeComponent,
    MCToolbarComponent,
    MCExpansionPanelComponent,
    MCToolbarComponent,
    MCAutoCompleteUserSingleComponent,
    MCAutoCompleteProductSingleComponent,
    MCAutoCompleteProjectSingleComponent,
    MCAutoCompleteFunctionalClusterSingleComponent,
    MCAutoCompleteGroupMultipleComponent,
    MCSelectSingleCaseActionComponent,
    MCFieldCaseActionComponent,
    MCHelpComponent,
    MatDialogChangeActionTitleComponent,
    MCAlertComponent,
    MCExpansionPanelListDocumentComponent,
    MCExpansionPanelListReviewComponent,
    MCExpansionPanelListMeetingsComponent,
    MCButtonComponent,
    MCButtonContainedComponent,
    MCButtonOutlinedComponent,
    MCButtonIconComponent,
    MCButtonTextComponent,
    CaseObjectOverviewListPanelComponent,
    MCButtonDynamicComponent,
    MCButtonIconOutlinedComponent,
    MCCardSummaryComponent,
    MCButtonOverlayTabbedComponent,
    MCButtonOverlayCardComponent,
    MCButtonOverlayIconComponent,
    MCMenuSortComponent,
    MCTextComponent,
    McTabHeaderBarComponent,
    MCExpansionDraggableSectionComponent,
    McInputTextSuffixComponent,
    MCAutoCompleteUserMultipleComponent,
    MCAutoCompleteUserMultipleComponent,
    MCListItemComponent,
    MCAutoCompleteUserMultipleComponent,
    McExpansionPanelListAirComponent,
    MCAirPbsExpansionPanelListComponent,
    McExpansionPanelListPbsComponent,
    MCButtonIconContainedComponent,
    MCInputDurationAgendaItemComponent,
    McAutoCompleteUserSingleCardComponent,
    AgendaOverviewCardComponent,
    PersonNamePipe,
    MCAutoCompleteProjectLeadComponent,
    MCDiaComponent,
    MCChipComponent,
    McLinkedItemComponent,
    MCChipComponent,
    MCDialogBannerComponent,
    McCbRulesComponent,
    MCAddCbMeetingDialogComponent,
    MCOverviewConfigurableCardComponent,
    McButtonToggleInputStatusAiComponent,
    MCAgendaListOverlayCardComponent,
    MCAutoCompleteGroupSingleComponent,
    MCButtonImsComponent,
    MCCurrencyFieldComponent,
    CaseObjectActionStatusCardComponent,
    MCUserActionsTabbedComponent,
    MCButtonRadioInputComponent,
    MCAutoCompleteProjectMultipleComponent,
    MCAutoCompleteProductMultipleComponent,
    MCAutoCompleteAirMultipleComponent,
    MCAutoCompletePbsMultipleComponent,
    MCAutoCompleteReleasePackageComponent,
    NotificationTypeCardComponent,
    MCCaseObjectOptionsComponent,
    NotificationTypePanelComponent,
    MCAnalyticsPanelComponent,
    LoaderComponent,
    MCEmptyStateComponent,
    DecisionLoaderComponent,
    CommentReplyComponent,
    DashboardGraphLoaderComponent,
    FileUploadFormComponent,
    CaseObjectListLoaderComponent,
    StatePanelLoaderComponent,
    ActionListLoaderComponent,
    NotificationListLoaderComponent,
    AgendaListLoaderComponent,
    MCConversationDialogComponent,
    MessageCardComponent,
    OverlayLoaderComponent,
    UsersIconFilterComponent,
    ReviewEntryListLoaderComponent,
    SidePanelRightMenuLoaderComponent,
    ReviewListLoaderComponent,
    MCAutoCompleteProductsAffectedMultipleComponent,
    McDividerComponent,
    McChipOverlayCardComponent,
    MatMultiAssigneeGroupsComponent,
    MCCaseObjectOverviewComponent,
    CaseObjectAnalyticsPanelComponent,
    MCCaseObjectOverviewCardListComponent,
    MCCaseObjectOverviewCardItemComponent,
    MCCaseObjectOverviewTableComponent,
    MCAssessmentDialogPIIAComponent,
    MatMultiAssigneeGroupsComponent,
    FilterMyTeamManagementPanelComponent,
    CaseObjectOverviewCardListPanelComponent,
    SolutionItemsOverviewComponent,
    SolutionItemsOverviewCardComponent,
    ImpactedItemDialogComponent,
    McAutoCompleteImpactedItemTypeSingleComponent,
    McExpansionPanelListWorkInstructionCommentsComponent,
    SwitchOwnerConfirmationDialogComponent,
    ReviewDetailsTableComponent,
    ExpansionPanelDisabledComponent,
    MCProblemItemsExpansionPanelComponent,
    MCAutoCompletePlmpcSingleComponent
  ],
  exports: [
    ScrollingModule,
    InfiniteScrollModule,
    MultiUserSearchComponent,
    FooterComponent,
    ObjectComponent,
    ObjectLinkComponent,
    MatIconModule,
    MatListModule,
    MatAutocompleteModule,
    MatInputModule,
    MatGridListModule,
    MatToolbarModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatMenuModule,
    MatRippleModule,
    CheckItemPipe,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputTextComponent,
    MatInputTextAreaComponent,
    MatSelectComponent,
    MatDatePickerComponent,
    MCBadgeComponent,
    PriorityTransformPipe,
    ContextIdTransformPipe,
    MatBadgeModule,
    UserImagePipe,
    UserRoleTransformPipe,
    ChangeUserRoleLabelsPipe,
    MatDialogDeleteConfirmationComponent,
    MCAddNotesComponent,
    MatSortModule,
    MatDividerModule,
    MatButtonToggleModule,
    MCCbcComponent,
    MCCBCCRComponent,
    TitleBarComponent,
    FilterBarComponent,
    MatDialogNavigationConfirmationComponent,
    MCMyTeamQuickCardComponent,
    MCMenuEmptyStateCardComponent,
    MatDialogInputUserSearchComponent,
    MatDatePickerCustomizedComponent,
    NgxChartsModule,
    NgxSkeletonLoaderModule,
    CaseObjectStatusCardComponent,
    CaseObjectOverviewCardComponent,
    MCCaseObjectListComponent,
    CaseObjectStatePanelComponent,
    CaseObjectStatePanelComponent,
    MCLinkedItemsPanelComponent,
    StatusCheckerPipe,
    GlobalSearchComponent,
    MatInputTextMultiChipComponent,
    ToggleFontSizeComponent,
    CaseObjectDetailsHeaderComponent,
    AddItemsContainerComponent,
    ExpansionPanelComponent,
    ActionPanelComponent,
    AgendaActionPanelComponent,
    SidePanelRightMenuComponent,
    ActionPanelIconComponent,
    HistoryQuickCardComponent,
    AgendaRuleSetComponent,
    MCSelectSingleComponent,
    AALSelectSingleModule,
    AALDatePickerModule,
    MCInputTextComponent,
    MCInputTextListComponent,
    MCSelectMultipleComponent,
    MCFieldComponent,
    MCInputTextAreaComponent,
    MCInputLinkComponent,
    MCInputTimeComponent,
    MCInputDurationComponent,
    MCInputCurrencyComponent,
    MCInputNumberComponent,
    MCButtonRadioComponent,
    MCButtonToggleComponent,
    MCSelectSingleInputComponent,
    MCSelectMultipleInputComponent,
    MCButtonToggleInputComponent,
    MCRichTextAreaComponent,
    MCFieldCompositeComponent,
    MCToolbarFieldComponent,
    MCToolbarComponent,
    MCDatePickerComponent,
    MCDatePickerSelectComponent,
    MCDatePickerRangeComponent,
    MCExpansionPanelComponent,
    MCAutoCompleteUserSingleComponent,
    MCAutoCompleteProductSingleComponent,
    MCAutoCompleteProjectSingleComponent,
    MCAutoCompleteProductsAffectedMultipleComponent,
    MCAutoCompleteFunctionalClusterSingleComponent,
    MCAutoCompleteGroupMultipleComponent,
    MCFieldCaseActionComponent,
    MCSelectSingleCaseActionComponent,
    MCHelpComponent,
    MatDialogChangeActionTitleComponent,
    MCAlertComponent,
    MCExpansionPanelListDocumentComponent,
    MCExpansionPanelListReviewComponent,
    MCExpansionPanelListMeetingsComponent,
    MCButtonComponent,
    MCButtonContainedComponent,
    MCButtonOutlinedComponent,
    MCButtonIconComponent,
    MCButtonTextComponent,
    CaseObjectOverviewListPanelComponent,
    MCCaseObjectCardListComponent,
    McAssessmentWizardPiiaModule,
    MCAssessmentWizardCIAModule,
    MCButtonIconOutlinedComponent,
    MCButtonDynamicComponent,
    MCCardSummaryComponent,
    CaseObjectTableComponent,
    MCButtonOverlayTabbedComponent,
    MCTextComponent,
    McTabHeaderBarComponent,
    MCButtonOverlayCardComponent,
    MCButtonOverlayIconComponent,
    MCMenuSortComponent,
    MCExpansionDraggableSectionComponent,
    McInputTextSuffixComponent,
    MCAutoCompleteUserMultipleComponent,
    MCAutoCompleteUserMultipleComponent,
    MCListItemComponent,
    MCAutoCompleteUserMultipleComponent,
    McExpansionPanelListAirComponent,
    MCAirPbsExpansionPanelListComponent,
    McExpansionPanelListPbsComponent,
    MCButtonIconContainedComponent,
    MCInputDurationAgendaItemComponent,
    McAutoCompleteUserSingleCardComponent,
    AgendaOverviewCardComponent,
    PersonNamePipe,
    MCAutoCompleteProjectLeadComponent,
    MCDiaComponent,
    MCChipComponent,
    MCDialogBannerComponent,
    McCbRulesComponent,
    MCOverviewConfigurableCardComponent,
    McButtonToggleInputStatusAiComponent,
    AALChipModule,
    MCAgendaListOverlayCardComponent,
    MCAutoCompleteGroupSingleComponent,
    MCButtonImsComponent,
    MCCurrencyFieldComponent,
    CaseObjectActionStatusCardComponent,
    MCButtonRadioInputComponent,
    MCUserActionsTabbedComponent,
    MCAutoCompleteReleasePackageComponent,
    MCCaseObjectOptionsComponent,
    NotificationTypePanelComponent,
    AALAnalyticsPanelModule,
    LoaderComponent,
    MCEmptyStateComponent,
    FileUploadFormComponent,
    MessageCardComponent,
    UsersIconFilterComponent,
    McDividerComponent,
    McChipOverlayCardComponent,
    MatMultiAssigneeGroupsComponent,
    MCCaseObjectOverviewComponent,
    CaseObjectAnalyticsPanelComponent,
    MCCaseObjectOverviewCardListComponent,
    MCCaseObjectOverviewCardItemComponent,
    MCCaseObjectOverviewTableComponent,
    CaseObjectOverviewCardListPanelComponent,
    SolutionItemsOverviewComponent,
    ImpactedItemDialogComponent,
    McExpansionPanelListWorkInstructionCommentsComponent,
    ExpansionPanelDisabledComponent,
    MCProblemItemsExpansionPanelComponent,
    MCAutoCompletePlmpcSingleComponent
  ],
  entryComponents: [
    MatDialogDeleteConfirmationComponent,
    MatDialogFilterGroupDeleteComponent,
    MatDialogNavigationConfirmationComponent,
    MatDialogObsoleteConfirmationComponent,
    LowSeveritySnackBarComponent,
    MatDialogInputUserSearchComponent,
    MatDialogNotificationComponent,
    MatNotificationSnackBarComponent,
    MatDialogImportQuickFilterComponent,
    MCSelectSingleCaseActionComponent,
    MatDialogChangeActionTitleComponent,
    MCAddCbMeetingDialogComponent,
    MCConversationDialogComponent,
    MCAssessmentDialogPIIAComponent
  ],
  providers: [{
    provide: DateAdapter,
    useClass: BsnlDateAdapter
  },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {float: 'always'}}]
})
export class SharedModule {
}
