import {
  AuthService,
  Cart,
  CartActions,
  CartDataService,
  CartSelectors,
  CartService,
  OCC_CART_ID_CURRENT,
  OCC_USER_ID_ANONYMOUS,
  StateWithCart,
  User
} from '@spartacus/core';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';
import {debounceTime, filter, map, shareReplay, take, tap} from 'rxjs/operators';
import {TmaActiveCartService} from './tma-active-cart.service';
import {combineLatest, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmaCartService extends CartService {

  protected readonly TMA_PREVIOUS_USER_ID_INITIAL_VALUE =
    'PREVIOUS_USER_ID_INITIAL_VALUE';
  protected tmaPreviousUserId = this.TMA_PREVIOUS_USER_ID_INITIAL_VALUE;
  protected _tmaActiveCart$: Observable<Cart>;

  constructor(
    protected store: Store<StateWithCart>,
    protected cartData: CartDataService,
    protected authService: AuthService,
    protected activeCartService: TmaActiveCartService
  ) {
    super(store, cartData, authService, activeCartService);
    this._tmaActiveCart$ = combineLatest([
      this.store.select(CartSelectors.getCartContent),
      this.store.select(CartSelectors.getCartLoading),
      this.authService.getUserToken(),
      this.store.select(CartSelectors.getCartLoaded),
    ]).pipe(
      // combineLatest emits multiple times on each property update instead of one emit
      // additionally dispatching actions that changes selectors used here needs to happen in order
      // for this asyncScheduler is used here
      debounceTime(0),
      filter(([, loading]) => !loading),
      tap(([cart, , userToken, loaded]) => {
        if (this.isUserJustLoggedIn(userToken.userId)) {
          this.loadOrMergeCart();
        } else if (
          (this.isCartCreated(cart) && this.isCartIncomplete(cart)) ||
          (this.isUserLoggedIn(userToken.userId) &&
            !this.isCartCreated(cart) &&
            !loaded) // try to load current cart for logged in user (loaded flag to prevent infinite loop when user doesn't have cart)
        ) {
          this.loadCart();
        }

        this.tmaPreviousUserId = userToken.userId;
      }),
      filter(
        ([cart]) =>
          !this.isCartCreated(cart) ||
          (this.isCartCreated(cart) && !this.isCartIncomplete(cart))
      ),
      map(([cart]) => cart),
      shareReplay({bufferSize: 1, refCount: true})
    );
  }

  addCartEntry(cartEntry: TmaOrderEntry, userId: string): void {
    if (this.activeCartService) {
      return this.activeCartService.addCartEntry(cartEntry, userId);
    }
    this.store
      .pipe(
        select(CartSelectors.getActiveCartState),
        tap(cartState => {
          if (!this.isCartCreated(cartState.value.content) && !cartState.loading) {
            this.store.dispatch(
              new CartActions.CreateCart({
                userId: this.cartData.userId,
              })
            );
          }
        }),
        filter(cartState => this.isCartCreated(cartState.value.content)),
        take(1)
      )
      .subscribe(cart => {
        this.store.dispatch(
          new TmaCartEntryActions.AddCartEntry({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            cartEntry: cartEntry
          })
        );
      });
  }

  updateCartEntry(cartEntry: TmaOrderEntry): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateCartEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        cartEntry: cartEntry
      })
    );
  }

  updateContractStartDate(entryNumber: string, contractStartDate: string): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateContractStartDate({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        entry: entryNumber,
        contractStartDate: contractStartDate
      })
    );
  }

  updateProvider(entryNumber: string, provider: string): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateProvider({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        entry: entryNumber,
        provider: provider
      })
    );
  }

  getLoaded(): Observable<boolean> {
    if (this.activeCartService) {
      return this.activeCartService.getLoaded();
    }
    return this.store.pipe(select(CartSelectors.getCartLoaded));
  }

  getActive(): Observable<Cart> {
    if (this.activeCartService) {
      return this.activeCartService.getActive();
    }
    return this._tmaActiveCart$;
  }

  isGuestCart(): boolean {
    if (this.activeCartService) {
      return this.activeCartService.isGuestCart();
    }
    return this.cartData.isGuestCart;
  }

  getEntries(): Observable<TmaOrderEntry[]> {
    if (this.activeCartService) {
      return this.activeCartService.getEntries();
    }
    return this.store.pipe(select(CartSelectors.getCartEntries));
  }

  /**
   * Add multiple entries to a cart
   * Requires a created cart
   * @param cartEntries : list of entries to add (TmaOrderEntry[])
   */
  addEntries(cartEntries: TmaOrderEntry[]): void {
    if (this.activeCartService) {
      return this.activeCartService.addEntries(cartEntries);
    }
    let newEntries = 0;
    this.getEntries()
      .pipe(
        tap(() => {
          // Keep adding entries until the user cart contains the same number of entries
          // as the guest cart did
          if (newEntries < cartEntries.length) {
            this.store.dispatch(
              new CartActions.CartAddEntry({
                userId: this.cartData.userId,
                cartId: this.cartData.cartId,
                productCode: cartEntries[newEntries].product.code,
                quantity: cartEntries[newEntries].quantity,
              })
            );
            newEntries++;
          }
        }),
        filter(() => newEntries === cartEntries.length),
        take(1)
      )
      .subscribe();
  }

  removeEntry(entry: TmaOrderEntry): void {
    if (this.activeCartService) {
      return this.activeCartService.removeEntry(entry);
    }
    this.store.dispatch(
      new CartActions.CartRemoveEntry({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        entry: entry.entryNumber,
      })
    );
  }

  getCartMergeComplete(): Observable<boolean> {
    return this.store.pipe(select(CartSelectors.getCartMergeComplete));
  }


  addEntry(productCode: string, quantity: number): void {
    if (this.activeCartService) {
      return this.activeCartService.addEntry(productCode, quantity);
    }
    this.store
      .pipe(
        select(CartSelectors.getActiveCartState),
        tap(cartState => {
          if (!this.isCartCreated(cartState.value.content) && !cartState.loading) {
            this.store.dispatch(
              new CartActions.CreateCart({
                userId: this.cartData.userId,
              })
            );
          }
        }),
        filter(cartState => this.isCartCreated(cartState.value.content)),
        take(1)
      )
      .subscribe(_ => {
        this.store.dispatch(
          new CartActions.CartAddEntry({
            userId: this.cartData.userId,
            cartId: this.cartData.cartId,
            productCode: productCode,
            quantity: quantity,
          })
        );
      });
  }

  updateEntry(entryNumber: string, quantity: number): void {
    if (this.activeCartService) {
      return this.activeCartService.updateEntry(
        parseInt(entryNumber, 10),
        quantity
      );
    }
    if (quantity > 0) {
      this.store.dispatch(
        new CartActions.CartUpdateEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
          qty: quantity,
        })
      );
    } else {
      this.store.dispatch(
        new CartActions.CartRemoveEntry({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          entry: entryNumber,
        })
      );
    }
  }

  getEntry(productCode: string): Observable<TmaOrderEntry> {
    if (this.activeCartService) {
      return this.activeCartService.getEntry(productCode);
    }
    return this.store.pipe(
      select(CartSelectors.getCartEntrySelectorFactory(productCode))
    );
  }

  addEmail(email: string): void {
    if (this.activeCartService) {
      return this.activeCartService.addEmail(email);
    }
    this.store.dispatch(
      new CartActions.AddEmailToCart({
        userId: this.cartData.userId,
        cartId: this.cartData.cartId,
        email: email,
      })
    );
  }

  getAssignedUser(): Observable<User> {
    if (this.activeCartService) {
      return this.activeCartService.getAssignedUser();
    }
    return this.store.pipe(select(CartSelectors.getCartUser));
  }

  protected loadOrMergeCart(): void {
    // for login user, whenever there's an existing cart, we will load the user
    // current cart and merge it into the existing cart
    if (!this.isCartCreated(this.cartData.cart)) {
      this.store.dispatch(
        new CartActions.LoadCart({
          userId: this.cartData.userId,
          cartId: OCC_CART_ID_CURRENT,
        })
      );
    } else if (this.isGuestCart()) {
      this.mergeGuestCart();
    } else {
      this.store.dispatch(
        new CartActions.MergeCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cart.guid,
        })
      );
    }
  }

  reloadActiveCart() {
    if (this.activeCartService) {
      this.activeCartService.initializeActiveCart();
    }
  }

  loadCart() {
    if (this.cartData.userId !== OCC_USER_ID_ANONYMOUS) {
      this.store.dispatch(
        new CartActions.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId
            ? this.cartData.cartId
            : OCC_CART_ID_CURRENT,
        })
      );
    } else {
      this.store.dispatch(
        new CartActions.LoadCart({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
        })
      );
    }
  }

  protected isCartCreated(cart: Cart): boolean {
    return cart && typeof cart.guid !== 'undefined';
  }

  protected isCartIncomplete(cart: Cart): boolean {
    return cart && Object.keys(cart).length <= 3;
  }

  protected isUserJustLoggedIn(userId: string): boolean {
    return (
      this.isUserLoggedIn(userId) &&
      this.tmaPreviousUserId !== userId && // *just* logged in
      this.tmaPreviousUserId !== this.TMA_PREVIOUS_USER_ID_INITIAL_VALUE // not app initialization
    );
  }

  private isUserLoggedIn(userId: string): boolean {
    return typeof userId !== 'undefined';
  }

  private mergeGuestCart(): void {
    let cartEntries: TmaOrderEntry[];
    this.getEntries()
      .pipe(take(1))
      .subscribe(entries => {
        cartEntries = entries;
      });

    this.store.dispatch(
      new CartActions.DeleteCart({
        userId: OCC_USER_ID_ANONYMOUS,
        cartId: this.cartData.cart.guid,
      })
    );

    this.store
      .pipe(
        select(CartSelectors.getActiveCartState),
        filter(cartState => !cartState.loading),
        tap(cartState => {
          // If the cart is not created it needs to be created
          // This step should happen before adding entries to avoid conflicts in the requests
          if (!this.isCartCreated(cartState.value.content)) {
            this.store.dispatch(
              new CartActions.CreateCart({
                userId: this.cartData.userId,
              })
            );
          }
        }),
        filter(cartState => this.isCartCreated(cartState.value.content)),
        take(1)
      )
      .subscribe(() => {
        this.addEntries(cartEntries);
      });
  }
}
