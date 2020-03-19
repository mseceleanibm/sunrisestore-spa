import {Injectable} from '@angular/core';
import {
  ActiveCartService,
  AuthService,
  Cart,
  EMAIL_PATTERN,
  MultiCartSelectors,
  OCC_CART_ID_CURRENT,
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_GUEST,
  OrderEntry,
  ProcessesLoaderState,
  StateWithMultiCart,
  User
} from '@spartacus/core';
import {select, Store} from '@ngrx/store';
import {TmaMultiCartService} from './tma-multi-cart.service';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';
import {EMPTY, Observable, timer} from 'rxjs';
import {debounce, distinctUntilChanged, filter, map, shareReplay, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {getCartIdByUserId, isTempCartId} from '../utils/tma-cart-utils';

@Injectable()
export class TmaActiveCartService extends ActiveCartService {

  protected readonly TMA_PREVIOUS_USER_ID_INITIAL_VALUE = 'PREVIOUS_USER_ID_INITIAL_VALUE';
  protected tmaPreviousUserId = this.TMA_PREVIOUS_USER_ID_INITIAL_VALUE;
  protected tmaUserId = OCC_USER_ID_ANONYMOUS;

  protected tmaCartId;
  protected tmaActiveCart$: Observable<Cart>;
  protected tmaCartUser: User;


  protected tmaActiveCartId$ = this.store.pipe(
    select(MultiCartSelectors.getActiveCartId),
    map(cartId => {
      if (!cartId) {
        return OCC_CART_ID_CURRENT;
      }
      return cartId;
    })
  );

  protected tmaCartSelector$ = this.tmaActiveCartId$.pipe(
    switchMap(cartId => this.multiCartService.getCartEntity(cartId))
  );


  constructor(
    protected store: Store<StateWithMultiCart>,
    protected authService: AuthService,
    protected multiCartService: TmaMultiCartService
  ) {
    super(store, authService, multiCartService);

    this.authService.getOccUserId().subscribe(userId => {
      this.tmaUserId = userId;
      if (this.tmaUserId !== OCC_USER_ID_ANONYMOUS) {
        if (this.isUserJustLoggedIn(userId)) {
          this.loadOrMergeCart(this.tmaCartId);
        }
      }
      this.tmaPreviousUserId = userId;
    });

    this.tmaActiveCartId$.subscribe(cartId => {
      this.tmaCartId = cartId;
    });

    this.initializeActiveCart();
  }

  /**
   * Add entry to active cart
   *
   * @param cartEntry The entry to be added
   */
  addCartEntry(cartEntry: TmaOrderEntry, userId: string): void {
    this.requiresLoadedCart().subscribe(cartState => {
      this.multiCartService.addCartEntry(
        this.tmaUserId,
        getCartIdByUserId(cartState.value, this.tmaUserId),
        cartEntry,
      );
      this.initializeActiveCart();
    });
  }

  /**
   * Returns true when cart is stable (not loading and not pending processes on cart)
   */
  getLoaded(): Observable<boolean> {
    // Debounce is used here, to avoid flickering when we switch between different cart entities.
    // For example during `addEntry` method. We might try to load current cart, so `current cart will be then active id.
    // After load fails we might create new cart so we switch to `temp-${uuid}` cart entity used when creating cart.
    // At the end we finally switch to cart `code` for cart id. Between those switches cart `getLoaded` function should not flicker.
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => {
        return this.multiCartService.isStable(cartId);
      }),
      debounce(state => (state ? timer(0) : EMPTY)),
      distinctUntilChanged()
    );
  }

  /**
   * Returns cart entries
   */
  getEntries(): Observable<OrderEntry[]> {
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => this.multiCartService.getEntries(cartId)),
      distinctUntilChanged()
    );
  }

  /**
   * Returns true for guest cart
   */
  isGuestCart(): boolean {
    return (
      this.tmaCartUser &&
      (this.tmaCartUser.name === OCC_USER_ID_GUEST ||
        this.isUserEmail(
          this.tmaCartUser.uid
            .split('|')
            .slice(1)
            .join('|')
        ))
    );
  }

  /**
   * Remove entry
   *
   * @param entry
   */
  removeEntry(entry: OrderEntry): void {
    this.multiCartService.removeEntry(
      this.tmaUserId,
      this.tmaCartId,
      entry.entryNumber
    );
  }

  /**
   * Returns active cart
   */
  getActive(): Observable<Cart> {
    return this.tmaActiveCart$;
  }

  /**
   * Returns active cart id
   */
  getActiveCartId(): Observable<string> {
    return this.tmaActiveCart$.pipe(
      map(cart => getCartIdByUserId(cart, this.tmaUserId)),
      distinctUntilChanged()
    );
  }

  protected isUserEmail(str: string): boolean {
    if (str) {
      return str.match(EMAIL_PATTERN) ? true : false;
    }
    return false;
  }

  initializeActiveCart() {
    this.tmaActiveCart$ = this.tmaCartSelector$.pipe(
      withLatestFrom(this.tmaActiveCartId$),
      map(([cartEntity, activeCartId]: [ProcessesLoaderState<Cart>, string]): {
        cart: Cart;
        cartId: string;
        isStable: boolean;
        loaded: boolean;
      } => {
        return {
          cart: cartEntity.value,
          cartId: activeCartId,
          isStable: !cartEntity.loading && cartEntity.processesCount === 0,
          loaded:
            (cartEntity.error || cartEntity.success) && !cartEntity.loading,
        };
      }),
      // we want to emit empty carts even if those are not stable
      // on merge cart action we want to switch to empty cart so no one would use old cartId which can be already obsolete
      // so on merge action the resulting stream looks like this: old_cart -> {} -> new_cart
      filter(({isStable, cart}) => isStable || this.isCartEmpty(cart)),
      tap(({cart, cartId, loaded, isStable}) => {
        if (
          isStable &&
          this.isCartEmpty(cart) &&
          !loaded &&
          !isTempCartId(cartId)
        ) {
          this.loadCart(cartId);
        }
      }),
      map(({cart}) => (cart ? cart : {})),
      tap(cart => {
        if (cart) {
          this.tmaCartUser = cart.user;
        }
      }),
      distinctUntilChanged(),
      shareReplay({bufferSize: 1, refCount: true})
    );
  }

  protected loadOrMergeCart(cartId: string): void {
    // for login user, whenever there's an existing cart, we will load the user
    // current cart and merge it into the existing cart
    if (!cartId || cartId === OCC_CART_ID_CURRENT) {
      this.multiCartService.loadCart({
        userId: this.tmaUserId,
        cartId: OCC_CART_ID_CURRENT,
        extraData: {
          active: true,
        },
      });
    } else if (this.isGuestCart()) {
      this.mergeGuestCart(cartId);
    } else {
      this.multiCartService.mergeToCurrentCart({
        userId: this.tmaUserId,
        cartId,
        extraData: {
          active: true,
        },
      });
    }
  }

  protected loadCart(cartId: string): void {
    if (this.tmaUserId !== OCC_USER_ID_ANONYMOUS) {
      this.multiCartService.loadCart({
        userId: this.tmaUserId,
        cartId: cartId ? cartId : OCC_CART_ID_CURRENT,
        extraData: {
          active: true,
        },
      });
    } else if (cartId && cartId !== OCC_CART_ID_CURRENT) {
      this.multiCartService.loadCart({
        userId: this.tmaUserId,
        cartId: cartId,
        extraData: {
          active: true,
        },
      });
    }
  }

  protected mergeGuestCart(cartId: string): void {
    let cartEntries: OrderEntry[];
    this.getEntries()
      .pipe(take(1))
      .subscribe(entries => {
        cartEntries = entries;
      });

    this.multiCartService.deleteCart(cartId, OCC_USER_ID_ANONYMOUS);

    this.addCartEntriesGuestMerge(cartEntries);
  }

  protected addCartEntriesGuestMerge(cartEntries: OrderEntry[]) {
    const entriesToAdd = cartEntries.map(entry => ({
      productCode: entry.product.code,
      quantity: entry.quantity,
    }));
    this.requiresLoadedCartForGuestMerge().subscribe(cartState => {
      this.multiCartService.addEntries(
        this.tmaUserId,
        getCartIdByUserId(cartState.value, this.tmaUserId),
        entriesToAdd
      );
    });
  }

  protected requiresLoadedCartForGuestMerge() {
    return this.requiresLoadedCart(
      this.tmaCartSelector$.pipe(filter(() => !this.isGuestCart()))
    );
  }

  protected isCartLoading(cartState) {
    // cart creating is always represented with loading flags
    // when all loading flags are false it means that we restored wrong cart id
    // could happen on context change or reload right in the middle on cart create call
    return (
      isTempCartId(this.tmaCartId) &&
      (cartState.loading || cartState.success || cartState.error)
    );
  }

  protected requiresLoadedCart(
    customCartSelector$?: Observable<ProcessesLoaderState<Cart>>
  ): Observable<ProcessesLoaderState<Cart>> {
    // For guest cart merge we want to filter guest cart in the whole stream
    // We have to wait with load/create/addEntry after guest cart will be deleted.
    // That's why you can provide custom selector with this filter applied.
    const cartSelector$ = customCartSelector$
      ? customCartSelector$
      : this.tmaCartSelector$;

    return cartSelector$.pipe(
      filter(cartState => !cartState.loading),
      // Avoid load/create call when there are new cart creating at the moment
      filter(cartState => !this.isCartLoading(cartState)),
      take(1),
      switchMap(cartState => {
        // Try to load the cart, because it might have been created on another device between our login and add entry call
        if (
          this.isCartEmpty(cartState.value) &&
          this.tmaUserId !== OCC_USER_ID_ANONYMOUS
        ) {
          this.loadCart(undefined);
        }
        return cartSelector$;
      }),
      filter(cartState => !cartState.loading),
      // create cart can happen to anonymous user if it is not empty or to any other user if it is loaded and empty
      filter(
        cartState =>
          this.tmaUserId === OCC_USER_ID_ANONYMOUS ||
          (cartState.success || cartState.error)
      ),
      take(1),
      switchMap(cartState => {
        if (this.isCartEmpty(cartState.value)) {
          this.multiCartService.createCart({
            userId: this.tmaUserId,
            extraData: {
              active: true,
            },
          });
        }
        return cartSelector$;
      }),
      filter(cartState => !cartState.loading),
      filter(cartState => cartState.success || cartState.error),
      // wait for active cart id to point to code/guid to avoid some work on temp cart entity
      filter(cartState => !this.isCartLoading(cartState)),
      filter(cartState => !this.isCartEmpty(cartState.value)),
      take(1)
    );
  }

  protected isCartEmpty(cart: Cart): boolean {
    return (
      !cart || (typeof cart === 'object' && Object.keys(cart).length === 0)
    );
  }

  protected isUserJustLoggedIn(userId: string): boolean {
    return (
      this.tmaPreviousUserId !== userId && // *just* logged in
      this.tmaPreviousUserId !== this.TMA_PREVIOUS_USER_ID_INITIAL_VALUE // not app initialization
    );
  }
}
