import {AddToCartComponent, CurrentProductService, ModalService} from '@spartacus/storefront';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TmaCartService} from '../../../features/cart/facade/tma-cart.service';
import {BaseSiteService, Cart, Product, ProductService, User, UserService} from '@spartacus/core';
import {filter, first} from 'rxjs/operators';
import {TmaProduct} from '../../../model/tma-product.model';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';
import {TmaProcessTypeEnum} from '../../../model/tma-cart.model';
import {Observable} from "rxjs";
import {TmaAddedToCartDialogComponent} from "./added-to-cart-dialog/tma-added-to-cart-dialog.component";

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAddToCartComponent extends AddToCartComponent {

  baseSiteId: string;
  activeUser$: Observable<User>;
  entries$: Observable<TmaOrderEntry[]>;

  constructor(
    protected cartService: TmaCartService,
    protected modalService: ModalService,
    protected currentProductService: CurrentProductService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected baseSiteService: BaseSiteService,
    protected productService: ProductService,
    protected userService: UserService) {
    super(cartService, modalService, currentProductService, changeDetectorRef);
  }

  ngOnInit(): void {
    this.baseSiteService.getActive().subscribe(baseSiteId => this.baseSiteId = baseSiteId);
    this.activeUser$ = this.userService.get();

    if (this.product) {
      this.productCode = this.product.code;
      this.cartEntry$ = this.cartService.getEntry(this.productCode);
      this.setStockInformation(this.product);
      this.changeDetectorRef.markForCheck();
    } else if (this.productCode) {
      this.cartEntry$ = this.cartService.getEntry(this.productCode);

      // force hasStock and quantity for the time being, as we do not have more info:
      this.quantity = 1;
      this.hasStock = true;
      this.changeDetectorRef.markForCheck();
    } else {
      this.subscription = this.currentProductService
        .getProduct()
        .pipe(filter(Boolean))
        .subscribe((product: Product) => {
          this.productCode = product.code;
          this.setStockInformation(product);
          this.cartEntry$ = this.cartService.getEntry(this.productCode);
          this.changeDetectorRef.markForCheck();
        });
    }

    this.entries$ = this.cartService.getEntries();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  addEntryToCart(activeUser, entries): void {
    let entryGroupNumber = this.getLargestEntryGroupNumber(entries) + 1;
    if (!this.productCode || this.quantity <= 0) {
      return;
    }

    // check item is already present in the cart
    // so modal will have proper header text displayed
    this.cartService
      .getEntry(this.productCode)
      .subscribe(entry => {
        if (entry) {
          this.increment = true;
        }

        this.productService.get(this.productCode).pipe(
          first(firstProduct => firstProduct != null)
        ).subscribe((product: TmaProduct) => {
          if (product.preconfigSpos) {
            this.openAddToCartModal(product, product.preconfigSpos.length, entries);
            this.cartService.addCartEntry(this.getCartEntry(this.productCode, product.preconfigSpos[0].code), activeUser.userId)
            for (var i = 1; i < product.preconfigSpos.length; i++) {
              this.cartService.addCartEntry(this.getCartEntry(this.productCode, product.preconfigSpos[i].code, entryGroupNumber), activeUser.userId)
            }
          } else {
            this.openAddToCartModal(product, 1, entries);
            this.cartService.addEntry(this.productCode, this.quantity);
          }
        });
        this.increment = false;
      })
      .unsubscribe();
  }

  protected openAddToCartModal(product: TmaProduct, quantityAdded: number, entries: TmaOrderEntry[]) {
    let modalInstance: any;
    this.modalRef = this.modalService.open(TmaAddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = this.cartEntry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
    modalInstance.backupEntry = this.getCartEntryWithProduct(product);
    modalInstance.backupCart = this.getCart(product, quantityAdded, entries);

    this.cartService.reloadActiveCart();
  }

  protected setStockInformation(product: Product): void {
    this.quantity = 1;
    this.hasStock =
      product.stock && product.stock.stockLevelStatus !== 'outOfStock';
    if (this.hasStock && product.stock.stockLevel) {
      this.maxQuantity = product.stock.stockLevel;
    }
  }

  protected getLargestEntryGroupNumber(entries): number {
    let largestEntryGroupNumber: number = 0;
    entries.forEach((entry: TmaOrderEntry) => {
      entry.entryGroupNumbers.forEach((egn: number) => {
        if (egn > largestEntryGroupNumber) {
          largestEntryGroupNumber = egn;
        }
      })
    });

    return largestEntryGroupNumber;
  }

  protected getCartEntryWithProduct(product: TmaProduct): TmaOrderEntry {
    return {
      product: product,
      processType: {id: TmaProcessTypeEnum.ACQUISITION},
      quantity: 1
    }
  }

  protected getCartEntry(rootBpoCode: string, preconfigSpo: string, entryGroupNumber?: number): TmaOrderEntry {
    return entryGroupNumber ? {
      entryGroupNumbers: [entryGroupNumber],
      product: {
        code: preconfigSpo,
      },
      processType: {id: TmaProcessTypeEnum.ACQUISITION},
      rootBpoCode: rootBpoCode,
      quantity: 1
    } : {
      product: {
        code: preconfigSpo,
      },
      processType: {id: TmaProcessTypeEnum.ACQUISITION},
      rootBpoCode: rootBpoCode,
      quantity: 1
    };
  }

  protected getCart(product: TmaProduct, quantityAdded: number, entries: TmaOrderEntry[]): Cart {
    let deliveredQuantity: number = entries.length + quantityAdded;
    console.log("entryNr: ", entries.length);
    console.log("quantAdded: ", quantityAdded);
    let entryPrice: string = '37.5';
    let recurringChargePeriod: string = product.code == 'freedom_europe_data' || product.code == 'freedom_young_europe_data' ? 'Monthly' : 'On First Bill';

    return {
      deliveryItemsQuantity: deliveredQuantity,
      // subTotal: {
      //   formattedValue: '$' + entryPrice + ' / ' + recurringChargePeriod
      // }
    };
  }

}
