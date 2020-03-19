import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {CartActions, CartEntryEffects, SiteContextActions} from '@spartacus/core';
import {from, Observable} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import * as TmaCartEntryActions from '../actions/tma-cart-entry.actions';
import {TmaCartEntryActionTypes} from '../actions/tma-cart-entry.actions';
import {TmaCartEntryConnector} from '../../../connector/cart/tma-cart-entry.connector';
import {withdrawOn} from '../../../../utils/tma-withdraw-on';
import {makeErrorSerializable} from '../../../../utils/tma-serialization-utils';

@Injectable()
export class TmaCartEntryEffects extends CartEntryEffects {

  private tmaContextChange$ = this.tmaActions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  @Effect()
  updateContractStartDate$: Observable<| TmaCartEntryActions.UpdateContractStartDateSuccess
    | TmaCartEntryActions.UpdateContractStartDateFail
    | CartActions.LoadCart> = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE),
    map((action: TmaCartEntryActions.UpdateContractStartDate) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .updateContractStartDate(payload.userId, payload.cartId, payload.entry, payload.contractStartDate)
        .pipe(
          map(() => {
            return new TmaCartEntryActions.UpdateContractStartDateSuccess({
              userId: payload.userId,
              cartId: payload.cartId
            });
          }),
          catchError(error =>
            from([
              new TmaCartEntryActions.UpdateContractStartDateFail(makeErrorSerializable(error)),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId,
              }),
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  );

  @Effect()
  updateProvider$: Observable<| TmaCartEntryActions.UpdateProviderSuccess
    | TmaCartEntryActions.UpdateProviderFail
    | CartActions.LoadCart> = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.UPDATE_PROVIDER),
    map((action: TmaCartEntryActions.UpdateProvider) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .updateProvider(payload.userId, payload.cartId, payload.entry, payload.provider)
        .pipe(
          map(() => {
            return new TmaCartEntryActions.UpdateProviderSuccess({
              userId: payload.userId,
              cartId: payload.cartId
            });
          }),
          catchError(error =>
            from([
              new TmaCartEntryActions.UpdateProviderFail(makeErrorSerializable(error)),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId,
              }),
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  );
  @Effect()
  addCartEntry$: Observable<| TmaCartEntryActions.AddCartEntrySuccess
    | TmaCartEntryActions.AddCartEntryFail
    | CartActions.LoadCart> = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.ADD_CART_ENTRY),
    map((action: TmaCartEntryActions.AddCartEntry) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .addCartEntry(payload.userId, payload.cartId, payload.cartEntry)
        .pipe(
          map((entry: any) => {
            return new TmaCartEntryActions.AddCartEntrySuccess({
              ...entry,
              userId: payload.userId,
              cartId: payload.cartId,
              cartEntry: payload.cartEntry,
            });
          }),
          catchError(error =>
            from([
              new TmaCartEntryActions.AddCartEntryFail(makeErrorSerializable(error)),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId,
              }),
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  );

  @Effect()
  updateCartEntry$: Observable<| TmaCartEntryActions.UpdateCartEntrySuccess
    | TmaCartEntryActions.UpdateCartEntryFail
    | CartActions.LoadCart> = this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.UPDATE_CART_ENTRY),
    map((action: TmaCartEntryActions.UpdateCartEntry) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .updateCartEntry(payload.userId, payload.cartId, payload.cartEntry)
        .pipe(
          map(() => {
            return new TmaCartEntryActions.UpdateCartEntrySuccess({
              userId: payload.userId,
              cartId: payload.cartId,
              cartEntry: payload.cartEntry,
            });
          }),
          catchError(error =>
            from([
              new TmaCartEntryActions.UpdateCartEntryFail(makeErrorSerializable(error)),
              new CartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId,
              }),
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  );

  constructor(private tmaActions$: Actions, private tmaCartEntryConnector: TmaCartEntryConnector) {
    super(tmaActions$, tmaCartEntryConnector);
  }
}
