import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConverterService, FeatureConfigService, OccCartEntryAdapter, OccEndpointsService} from '@spartacus/core';
import {Observable} from 'rxjs';
import {TmaCartModification, TmaProcessTypeEnum, TmaRelatedPartyRole} from '../../../model/tma-cart.model';
import {TMA_CART_MODIFICATION_NORMALIZER} from '../../../features/connector/entry/converters';
import {TmaCartEntryAdapter} from '../../../features/cart/store/adapters/tma-cart-entry.adapter';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';

@Injectable({
  providedIn: 'root'
})
export class TmaOccCartEntryAdapter extends OccCartEntryAdapter implements TmaCartEntryAdapter {

  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService,
    protected featureConfigService?: FeatureConfigService
  ) {
    super(http, occEndpointsService, converterService, featureConfigService);
  }

  updateContractStartDate(
    userId: string,
    cartId: string,
    entryNumber: string,
    contractStartDate: string
  ): Observable<TmaCartModification> {
    let params = {};

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.getUrl(
      'updateEntries',
      {userId, cartId, entryNumber},
      {...params}
    );

    let entry: TmaCartModification;
    entry = {contractStartDate: contractStartDate};

    return this.http
      .patch<TmaCartModification>(url, entry, {headers})
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }

  updateProvider(
    userId: string,
    cartId: string,
    entryNumber: string,
    provider: string
  ): Observable<TmaCartModification> {
    let params = {};

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.getUrl(
      'updateEntries',
      {userId, cartId, entryNumber},
      {...params}
    );

    let entry: TmaCartModification;
    if (provider == '') {
      entry = {
        processType: {id: TmaProcessTypeEnum.ACQUISITION},
        subscribedProduct: {relatedParty: [{id: provider, role: TmaRelatedPartyRole.SERVICE_PROVIDER}]}
      };

    } else {
      entry = {
        processType: {id: TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER},
        subscribedProduct: {relatedParty: [{id: provider, role: TmaRelatedPartyRole.SERVICE_PROVIDER}]}
      };
    }

    return this.http
      .patch<TmaCartModification>(url, entry, {headers})
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }

  addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.getUrl(
      'addEntries',
      {userId, cartId}
    );

    return this.http
      .post<TmaCartModification>(url, cartEntry, {headers})
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }

  updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const entryNumber = cartEntry.entryNumber;
    const url = this.occEndpointsService.getUrl(
      'updateEntries',
      {userId, cartId, entryNumber}
    );

    return this.http
      .patch<TmaCartModification>(url, cartEntry, {headers})
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }
}
