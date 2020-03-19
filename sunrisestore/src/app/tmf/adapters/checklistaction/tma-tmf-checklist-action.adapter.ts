import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TmaChecklistAction} from '../../../model/tma-checklist-action.model';
import {TmaChecklistActionAdapter} from '../../../features/checklistaction/store/adapters/tma-checklist-action-adapter';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TmfEndpointsService} from '../../services/tmf-endpoints.service';
import {ConverterService} from '@spartacus/core';
import {TMA_CHECKLIST_ACTION_NORMALIZER} from '../../../features/connector/entry/converters';
import {Tmf} from '../../tmf-models/tmf.models';


@Injectable({
  providedIn: 'root'
})
export class TmaTmfChecklistActionAdapter implements TmaChecklistActionAdapter {

  constructor(protected http: HttpClient, protected tmfEndpointsService: TmfEndpointsService, protected converterService: ConverterService) {
  }

  getChecklistActions(
    baseSiteId: string,
    productId: string
  ): Observable<TmaChecklistAction[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let queryParameters = Array();
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['productOffering.id'] = productId;


    const url = this.tmfEndpointsService.getUrl('checklistAction', [], queryParameters);

    return this.http
      .get<Tmf.TmaChecklistAction[]>(url, {headers})
      .pipe(this.converterService.pipeableMany(TMA_CHECKLIST_ACTION_NORMALIZER));
  }
}
