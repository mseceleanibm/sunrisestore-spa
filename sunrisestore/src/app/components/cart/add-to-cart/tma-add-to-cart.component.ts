import {AddedToCartDialogComponent, AddToCartComponent, CurrentProductService, ModalService} from '@spartacus/storefront';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TmaCartService} from '../../../features/cart/facade/tma-cart.service';
import {BaseSiteService, Product, ProductService, User, UserService} from '@spartacus/core';
import {filter, first} from 'rxjs/operators';
import {TmaProduct} from '../../../model/tma-product.model';
import {TmaOrderEntry} from '../../../model/tma-cart.entry.model';
import {TmaProcessTypeEnum} from '../../../model/tma-cart.model';
import {Observable} from "rxjs";

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAddToCartComponent extends AddToCartComponent {

  baseSiteId: string;
  activeUser$: Observable<User>;
  entries$: Observable<TmaOrderEntry[]>;

  constructor(protected cartService: TmaCartService, protected modalService: ModalService,
              protected currentProductService: CurrentProductService, protected changeDetectorRef: ChangeDetectorRef,
              protected baseSiteService: BaseSiteService, protected productService: ProductService,
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
      // this.checklistAction$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, this.productCode);
      this.changeDetectorRef.markForCheck();
    } else if (this.productCode) {
      this.cartEntry$ = this.cartService.getEntry(this.productCode);
      // this.checklistAction$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, this.productCode);
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
          // this.checklistAction$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, this.productCode);
          this.cartEntry$ = this.cartService.getEntry(this.productCode);
          this.changeDetectorRef.markForCheck();
        });
    }

    this.entries$ = this.cartService.getEntries();
  }

  addEntryToCart(activeUser, entries): void {
    let entryGroupNumber = this.getLargestEntryGroupNumber(entries) + 1;
    if (!this.productCode || this.quantity <= 0) {
      return;
    }

    // this.product = this.currentProductService.getProduct(this.productCode);

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
            this.cartService.addCartEntry(this.getCartEntry(product.preconfigSpos[0].code, this.productCode), activeUser.userId)
            for (var i = 1; i < product.preconfigSpos.length; i++) {
              // product.preconfigSpos.forEach(
              //   (preconfigSpo: TmaProduct) =>
              this.cartService.addCartEntry(this.getCartEntry(product.preconfigSpos[i].code, this.productCode, entryGroupNumber), activeUser.userId)
              // );
            }
            this.openModal2();
          } else {
            this.cartService.addEntry(this.productCode, this.quantity);
            this.openModal2();

          }
        });
        this.increment = false;
      })
      .unsubscribe();
  }

  protected getCartEntry(preconfigSpo: string, rootBpoCode: string, entryGroupNumber?: number): TmaOrderEntry {
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

  private openModal2() {
    let modalInstance: any;
    this.modalRef = this.modalService.open(AddedToCartDialogComponent, {
      centered: true,
      size: 'lg',
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.entry$ = this.cartEntry$;
    modalInstance.cart$ = this.cartService.getActive();
    modalInstance.loaded$ = this.cartService.getLoaded();
    modalInstance.quantity = this.quantity;
    modalInstance.increment = this.increment;
    // this.cartService.loadCart();
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

  ngOnDestroy()
    :
    void {
    super.ngOnDestroy();
  }

}
