import {CartActions, MultiCartSelectors, MultiCartService, StateWithMultiCart} from '@spartacus/core';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import {EMPTY, Observable, timer} from 'rxjs';
import {debounce, distinctUntilChanged} from 'rxjs/operators';

@Injectable()
export class TmaMultiCartService extends MultiCartService {

  constructor(
    protected store: Store<StateWithMultiCart>
  ) {
    super(store);
  }

  /**
   * Add entry to cart
   *
   * @param userId The identifier of the user
   * @param cartId The identifier of tha cart
   * @param cartEntry The entry to be added
   */
  addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): void {
    this.store.dispatch(
      new TmaCartEntryActions.AddCartEntry({
        userId,
        cartId,
        cartEntry
      })
    );
  }

  /**
   * Returns true when there are no operations on that in progress and it is not currently loading
   *
   * @param cartId
   */
  isStable(cartId: string): Observable<boolean> {
    return this.store.pipe(
      select(MultiCartSelectors.getCartIsStableSelectorFactory(cartId)),
      // We dispatch a lot of actions just after finishing some process or loading, so we want this flag not to flicker.
      // This flickering should only be avoided when switching from false to true
      // Start of loading should be showed instantly (no debounce)
      // Extra actions are only dispatched after some loading
      debounce(isStable => (isStable ? timer(0) : EMPTY)),
      distinctUntilChanged()
    );
  }

  /**
   * Remove entry from cart
   *
   * @param userId
   * @param cartId
   * @param entryNumber
   */
  removeEntry(userId: string, cartId: string, entryNumber: number): void {
    this.store.dispatch(
      new CartActions.CartRemoveEntry({
        userId,
        cartId,
        entry: entryNumber,
      })
    );
  }
}
