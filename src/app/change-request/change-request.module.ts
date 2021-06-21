import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {DndModule} from 'ngx-drag-drop';
import {SharedModule} from '../shared/shared.module';
import {ProjectMatDialogLinkedChangeRequestsComponent} from './project/project-change-request-details/project-change-request-define-solution/project-mat-dialog-linked-change-requests/project-mat-dialog-linked-change-requests.component';
import {ChangeRequestListComponent} from './change-request-list/change-request-list.component';
import {ChangeRequestRoutingModule} from './change-request-routing.module';
import {ChangeRequestService} from './change-request.service';
import {changeRequestReducers} from './store';
import {ProjectDefiningSolutionComponent} from './project/project-change-request-implementation-strategy/project-defining-solution/project-defining-solution.component';
import {ProjectAnalyzeImpactComponent} from './project/project-change-request-implementation-strategy/project-analyze-impact/project-analyze-impact.component';
import {ProjectAirPbsIssuesListComponent} from './project/project-change-request-implementation-strategy/project-defining-solution/project-air-pbs-issues-list/project-air-pbs-issues-list.component';
import {MCEmptyDecisionsCardComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decisions/empty-decisions-card/empty-decisions-card.component';
import {CrOfflineDecisionComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decisions/agenda-cards/cr-offline-decision/cr-offline-decision.component';
import {CrOnlineDecisionComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decisions/agenda-cards/cr-online-decision/cr-online-decision.component';
import {CrDecisionComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decisions/agenda-cards/cr-decision.component';
import {ProjectMatItemsListCardComponent} from './project/project-change-request-implementation-strategy/project-defining-solution/project-air-pbs-issues-list/project-mat-items-list-card/project-mat-items-list-card.component';

import { ProjectChangeRequestCIAComponent } from './project/project-change-request-cia/project-change-request-cia.component';
import { ProjectChangeRequestDefineScopeDialogComponent } from './project/project-change-request-details/project-change-request-define-solution/project-change-request-define-scope-dialog/project-change-request-define-scope-dialog.component';
import {ChangeRequestCloseComponent} from './shared/change-request-close/change-request-close.component';
import {CreatorChangeRequestDetailsComponent} from './creator/creator-change-request-details/creator-change-request-details.component';
import {CreatorMatDialogLinkedChangeRequestsComponent} from './creator/creator-change-request-details/creator-change-request-define-solution/creator-mat-dialog-linked-change-requests/creator-mat-dialog-linked-change-requests.component';
import {McExpansionPanelCreatorCiaComponent} from './creator/creator-change-request-details/creator-change-request-analyze-impact/creator-change-request-customer-impact/mc-expansion-panel-creator-cia/mc-expansion-panel-creator-cia.component';
import {CreatorChangeRequestAnalyzeImpactComponent} from './creator/creator-change-request-details/creator-change-request-analyze-impact/creator-change-request-analyze-impact.component';
import {CreatorDefineScopeDialogInfoComponent} from './creator/creator-change-request-details/creator-change-request-define-solution/creator-change-request-define-scope-dialog/creator-define-scope-dialog-info/creator-define-scope-dialog-info.component';
import {CreatorChangeRequestDecisionsComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decisions/creator-change-request-decisions.component';
import {CreatorChangeRequestDecideComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decide.component';
import {CreatorChangeRequestCustomerImpactComponent} from './creator/creator-change-request-details/creator-change-request-analyze-impact/creator-change-request-customer-impact/creator-change-request-customer-impact.component';
import {CreatorCrOnlineDecisionComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decisions/agenda-cards/cr-online-decision/cr-online-decision.component';
import {CreatorChangeRequestDefineScopeDialogComponent} from './creator/creator-change-request-details/creator-change-request-define-solution/creator-change-request-define-scope-dialog/creator-change-request-define-scope-dialog.component';
import {CreatorChangeRequestDefineSolutionComponent} from './creator/creator-change-request-details/creator-change-request-define-solution/creator-change-request-define-solution.component';
import {CreatorCrDecisionComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decisions/agenda-cards/cr-decision.component';
import {MCCreatorEmptyDecisionsCardComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decisions/empty-decisions-card/empty-decisions-card.component';
import {CreatorCrOfflineDecisionComponent} from './creator/creator-change-request-details/creator-change-request-decide/creator-change-request-decisions/agenda-cards/cr-offline-decision/cr-offline-decision.component';
import {CreatorChangeRequestImpactAnalysisComponent} from './creator/creator-change-request-details/creator-change-request-analyze-impact/creator-change-request-impact-analysis/creator-change-request-impact-analysis.component';
import {CreatorChangeRequestCIAComponent} from './creator/creator-change-request-cia/creator-change-request-cia.component';
import {CreatorImplementationStrategyComponent} from './creator/creator-change-request-implementation-strategy/creator-implementation-strategy.component';
import {CreatorMatItemsListCardComponent} from './creator/creator-change-request-implementation-strategy/creator-defining-solution/creator-air-pbs-issues-list/creator-mat-items-list-card/creator-mat-items-list-card.component';
import {CreatorDefiningSolutionComponent} from './creator/creator-change-request-implementation-strategy/creator-defining-solution/creator-defining-solution.component';
import {CreatorAirPbsIssuesListComponent} from './creator/creator-change-request-implementation-strategy/creator-defining-solution/creator-air-pbs-issues-list/creator-air-pbs-issues-list.component';
import {CreatorAnalyzeImpactComponent} from './creator/creator-change-request-implementation-strategy/creator-analyze-impact/creator-analyze-impact.component';
import {ChangeRequestDetailsCoreComponent} from './shared/change-request-detail/change-request-details-core.component';
import {ChangeRequestDetailComponent} from './shared/change-request-detail/change-request-detail.component';
import {ChangeRequestImplementationStrategyComponent} from './shared/change-request-implementation-strategy/change-request-implementation-strategy.component';
import {ChangeRequestImplementationStrategyCoreComponent} from './shared/change-request-implementation-strategy/change-request-implementation-strategy-core.component';
import {ChangeRequestCIAComponent} from './shared/change-request-cia/change-request-cia.component';
import {ChangeRequestCIACoreComponent} from './shared/change-request-cia/change-request-cia-core.component';
import {CreatorChangeRequestRequestingComponent} from './creator/creator-change-request-details/creator-change-request-requesting/creator-change-request-requesting.component';

import {ProjectChangeRequestDetailsComponent} from './project/project-change-request-details/project-change-request-details.component';
import {ProjectImplementationStrategyComponent} from './project/project-change-request-implementation-strategy/project-implementation-strategy.component';
import {ProjectChangeRequestRequestingComponent} from './project/project-change-request-details/project-change-request-requesting/project-change-request-requesting.component';
import {ProjectChangeRequestDefineSolutionComponent} from './project/project-change-request-details/project-change-request-define-solution/project-change-request-define-solution.component';
import {McProjectPicturesComponent} from './project/project-change-request-details/project-change-request-define-solution/mc-project-pictures/mc-project-pictures.component';
import {ProjectChangeRequestDecisionsComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decisions/project-change-request-decisions.component';
import {ProjectChangeRequestDecideComponent} from './project/project-change-request-details/project-change-request-decide/project-change-request-decide.component';
import {ProjectChangeRequestAnalyzeImpactComponent} from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-analyze-impact.component';
import {ProjectChangeRequestCustomerImpactComponent} from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-customer-impact/project-change-request-customer-impact.component';
import {ProjectChangeRequestImpactAnalysisComponent} from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-impact-analysis/project-change-request-impact-analysis.component';
import {McExpansionPanelProjectCiaComponent} from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-customer-impact/mc-expansion-panel-project-cia/mc-expansion-panel-project-cia.component';
import {OverwriteOrNotComponent} from './shared/import-air-pbs-issues-dialog/overwrite-or-not/overwrite-or-not.component';
import {SelectAirPbsComponent} from './shared/import-air-pbs-issues-dialog/select-air-pbs/select-air-pbs.component';
import {ImportContentCardComponent} from './shared/import-air-pbs-issues-dialog/overwrite-or-not/import-content-card/import-content-card.component';
import {ImportAirPbsIssuesDialogComponent} from './shared/import-air-pbs-issues-dialog/import-air-pbs-issues-dialog.component';
import {AirPbsImportInfoComponent} from './shared/import-air-pbs-issues-dialog/air-pbs-import-info/air-pbs-import-info.component';
import {AirPbsItemsContainerComponent} from './shared/import-air-pbs-issues-dialog/select-air-pbs/air-pbs-items-container/air-pbs-items-container.component';
import {SortAirPbsComponent} from './shared/import-air-pbs-issues-dialog/sort-air-pbs/sort-air-pbs.component';
import {AirPbsDescriptionComponent} from './shared/import-air-pbs-issues-dialog/shared/air-pbs-description/air-pbs-description.component';
import { McExpansionPanelListSciaComponent } from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-customer-impact/mc-expansion-panel-list-scia/mc-expansion-panel-list-scia.component';
import { CreateSciaDialogComponent } from './project/project-change-request-details/project-change-request-analyze-impact/project-change-request-customer-impact/create-scia-dialog/create-scia-dialog.component';
import {ProjectDefineScopeDialogInfoComponent} from './project/project-change-request-details/project-change-request-define-solution/project-change-request-define-scope-dialog/project-define-scope-dialog-info/project-define-scope-dialog-info.component';
import { MyTeamModule } from '../my-team/my-team.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangeRequestRoutingModule,
    SharedModule,
    MyTeamModule,
    DndModule,
    StoreModule.forFeature('changeRequest', changeRequestReducers),
    AALExpansionPanelListModule,
    AALExpansionPanelOverviewCardListModule,
    AALCommonModule
  ],
  declarations: [
    ChangeRequestListComponent,
    ProjectChangeRequestDetailsComponent,
    CreatorChangeRequestDetailsComponent,
    ChangeRequestDetailComponent,
    ChangeRequestDetailsCoreComponent,
    ProjectChangeRequestAnalyzeImpactComponent,
    CreatorChangeRequestAnalyzeImpactComponent,
    ProjectChangeRequestDefineSolutionComponent,
    CreatorChangeRequestDefineSolutionComponent,
    ProjectChangeRequestRequestingComponent,
    CreatorChangeRequestRequestingComponent,
    ProjectChangeRequestDecideComponent,
    CreatorChangeRequestDecideComponent,
    ProjectImplementationStrategyComponent,
    CreatorImplementationStrategyComponent,
    ChangeRequestCloseComponent,
    ProjectMatDialogLinkedChangeRequestsComponent,
    CreatorMatDialogLinkedChangeRequestsComponent,
    ProjectDefiningSolutionComponent,
    CreatorDefiningSolutionComponent,
    ProjectAnalyzeImpactComponent,
    CreatorAnalyzeImpactComponent,
    ProjectAirPbsIssuesListComponent,
    CreatorAirPbsIssuesListComponent,
    ImportAirPbsIssuesDialogComponent,
    SelectAirPbsComponent,
    AirPbsItemsContainerComponent,
    AirPbsDescriptionComponent,
    OverwriteOrNotComponent,
    SortAirPbsComponent,
    ImportContentCardComponent,
    AirPbsImportInfoComponent,
    MCEmptyDecisionsCardComponent,
    MCCreatorEmptyDecisionsCardComponent,
    ProjectChangeRequestDecisionsComponent,
    CreatorChangeRequestDecisionsComponent,
    CrOfflineDecisionComponent,
    CreatorCrOfflineDecisionComponent,
    CrOnlineDecisionComponent,
    CreatorCrOnlineDecisionComponent,
    CrDecisionComponent,
    CreatorCrDecisionComponent,
    McProjectPicturesComponent,
    ProjectMatItemsListCardComponent,
    CreatorMatItemsListCardComponent,
    ProjectChangeRequestCustomerImpactComponent,
    CreatorChangeRequestCustomerImpactComponent,
    ProjectChangeRequestImpactAnalysisComponent,
    CreatorChangeRequestImpactAnalysisComponent,
    ProjectChangeRequestCIAComponent,
    CreatorChangeRequestCIAComponent,
    ChangeRequestCIAComponent,
    ChangeRequestCIACoreComponent,
    McExpansionPanelProjectCiaComponent,
    McExpansionPanelCreatorCiaComponent,
    ProjectChangeRequestImpactAnalysisComponent,
    CreatorChangeRequestImpactAnalysisComponent,
    ProjectChangeRequestDefineScopeDialogComponent,
    CreatorChangeRequestDefineScopeDialogComponent,
    ProjectDefineScopeDialogInfoComponent,
    CreatorDefineScopeDialogInfoComponent,
    ChangeRequestImplementationStrategyComponent,
    ChangeRequestImplementationStrategyCoreComponent,
    McExpansionPanelListSciaComponent,
    CreateSciaDialogComponent
  ],
  entryComponents: [
    ProjectMatDialogLinkedChangeRequestsComponent, ImportAirPbsIssuesDialogComponent,
    CreatorMatDialogLinkedChangeRequestsComponent
  ],
  providers: [ChangeRequestService],
  exports: [AALCommonModule, SharedModule]
})
export class ChangeRequestModule {
}
