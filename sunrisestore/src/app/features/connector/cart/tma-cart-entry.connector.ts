import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CartEntryConnector, CartModification} from '@spartacus/core';
import {TmaCartEntryAdapter} from '../../cart/store/adapters/tma-cart-entry.adapter';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';

@Injectable({
  providedIn: 'root',
})
export class TmaCartEntryConnector extends CartEntryConnector {
  constructor(protected adapter: TmaCartEntryAdapter) {
    super(adapter);
  }

  public updateContractStartDate(
    userId: string,
    cartId: string,
    entryNumber: string,
    contractStartDate: string
  ): Observable<CartModification> {
    return this.adapter.updateContractStartDate(userId, cartId, entryNumber, contractStartDate);
  }

  public updateProvider(
    userId: string,
    cartId: string,
    entryNumber: string,
    provider: string
  ): Observable<CartModification> {
    return this.adapter.updateProvider(userId, cartId, entryNumber, provider);
  }

  public addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.addCartEntry(userId, cartId, cartEntry);
  }

  public updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.updateCartEntry(userId, cartId, cartEntry);
  }
}
