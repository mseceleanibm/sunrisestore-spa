import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as TmaChecklistActions from '../actions/tma-checklist-action.action';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {TmaChecklistActionTypes} from '../actions/tma-checklist-action.action';
import {TmaChecklistActionConnector} from '../../../connector/checklistaction/tma-checklist-action.connector';
import {makeErrorSerializable} from '../../../../utils/tma-serialization-utils';
import {TmaChecklistAction} from '../../../../model/tma-checklist-action.model';
import {Action} from '@ngrx/store';


@Injectable()
export class TmaChecklistActionEffect {

  constructor(protected actions$: Actions, protected tmaChecklistActionConnector: TmaChecklistActionConnector) {
  }

  @Effect()
  loadChecklistAction$: Observable<Action> = this.actions$.pipe(
    ofType(TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS),
    map((action: TmaChecklistActions.LoadChecklistActions) => action.payload),
    mergeMap(payload => {
        return this.tmaChecklistActionConnector.getChecklistActions(payload.baseSiteId, payload.productCode).pipe(
          map((checklistActions: TmaChecklistAction[]) => {
            return new TmaChecklistActions.LoadChecklistActionsSuccess({
              checklistAction: checklistActions,
              productCode: payload.productCode,
              baseSiteId: payload.baseSiteId
            });
          }),
          catchError(error =>
            of(
              new TmaChecklistActions.LoadChecklistActionsFail(
                makeErrorSerializable(error))
            ))
        );
      }
    )
  );
}
