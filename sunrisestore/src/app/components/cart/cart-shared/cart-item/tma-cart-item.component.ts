import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItemComponent, Item} from '@spartacus/storefront';
import {FeatureConfigService, ProductService} from '@spartacus/core';
import {TmaPlaceRole, TmaProcessTypeEnum, TmaRelatedPartyRole, TmaSubscribedProduct} from '../../../../model/tma-cart.model';
import {TmaCartService} from '../../../../features/cart/facade/tma-cart.service';
import {TmaCartPrice, TmaOrderEntry} from '../../../../model/tma-cart.entry.model';
import {TmaProduct} from '../../../../model/tma-product.model';
import {Router} from "@angular/router";
import {Observable} from "rxjs";

export interface TmaItem extends Item {
  entryNumber: number;
  subscribedProduct?: TmaSubscribedProduct;
  cartPrice?: TmaCartPrice;
  entryGroupNumbers?: number[];
}

export interface CartItemComponentOptions {
  isSaveForLater?: boolean;
  optionalBtn?: any;
}

@Component({
  selector: 'cx-cart-item',
  templateUrl: './tma-cart-item.component.html',
  styleUrls: ['./tma-cart-item.component.scss']
})
export default class TmaCartItemComponent extends CartItemComponent {

  serviceProvider: string;

  @Input()
  options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
  };

  @Input()
  item: TmaItem;

  @Output()
  updateStartDate = new EventEmitter<any>();

  @Output()
  updateProvider = new EventEmitter<any>();

  product$: Observable<TmaProduct>;

  constructor(
    protected featureConfig: FeatureConfigService,
    protected cartService: TmaCartService,
    protected productService: ProductService,
    protected router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.serviceProvider = this.getServiceProvider(this.item);
    this.product$ = this.productService.get(this.item.product.code);
  }

  updateContractStartDate(contractStartDate: string) {
    this.updateStartDate.emit({item: this.item, contractStartDate: contractStartDate});
  }

  move(): void {
    let orderEntry: TmaOrderEntry = {
      entryNumber: this.item.entryNumber,
      processType: {id: TmaProcessTypeEnum.ACQUISITION},
    };

    this.cartService.updateCartEntry(orderEntry);
  }

  switchProvider(
    {
      serviceProvider
    }: {
      serviceProvider: string
    }): void {
    this.updateProvider.emit({item: this.item, provider: serviceProvider});
  }

  protected getServiceProvider(item: TmaItem): string {
    this.serviceProvider = item &&
    item.subscribedProduct &&
    item.subscribedProduct.relatedParty ? item.subscribedProduct.relatedParty.find(relatedParty => relatedParty.role == TmaRelatedPartyRole.SERVICE_PROVIDER).id : null;
    return this.serviceProvider;
  }

  protected getReasonForPurchase(): string {
    return this.serviceProvider ? 'switchProvider' : 'move';
  }

  protected getAddressId(item: TmaItem): string {
    return item && item.subscribedProduct && item.subscribedProduct.place ? item.subscribedProduct.place.find(place => place.role == TmaPlaceRole.INSTALLATION_ADDRESS).id : '';
  }

  protected hasAddress(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.place &&
      this.item.subscribedProduct.place.find(place => place.role == TmaPlaceRole.INSTALLATION_ADDRESS));
  }

  protected isSaveForLaterEnabled(): boolean {
    if (this.featureConfig) {
      return this.featureConfig.isEnabled('saveForLater');
    }
    return false;
  }

  protected getPrice(): string {
    const tmaChildCartPrice = this.item.cartPrice.cartPrice.find(cartPrice => cartPrice != null);
    if (tmaChildCartPrice) {
      return tmaChildCartPrice.taxIncludedAmount.value + ' ' + tmaChildCartPrice.taxIncludedAmount.currencyIso + ' /' + tmaChildCartPrice.recurringChargePeriod;
    }
  }
}
