import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AppActionTypes from '../actions/app.actions';
import {TaskSchedulerService} from '../../core/services/task-scheduler.service';
import {EMPTY, forkJoin} from 'rxjs';
import {Categories} from '../../shared/models/mc-presentation.model';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';

@Injectable()
export class BackgroundTasksEffect {
  getMockDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.loadBackgroundTaskCounts),
    tap(() => {
      console.log('new getBackgroundTasks occurred in queue');
    }),
    mergeMap(() => {
        return forkJoin([
          this.taskSchedulerService.getBackgroundMyTeamTasks(true),
          this.taskSchedulerService.getBackgroundAgendaTasks(true),
          this.taskSchedulerService.getBackgroundRPTasks(true),
          this.taskSchedulerService.getBackgroundCRTasks(true)
        ]).pipe(map((backgroundTasks) => {
            return AppActionTypes.backgroundTaskCountsUpdated(backgroundTasks as Categories[]);
          },
          catchError(() => EMPTY)
        ));
      }
    )
    )
  );

  constructor(private actions$: Actions,
              private readonly taskSchedulerService: TaskSchedulerService) {
  }
}
