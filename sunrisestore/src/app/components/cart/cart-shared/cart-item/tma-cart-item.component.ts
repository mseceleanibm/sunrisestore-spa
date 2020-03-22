import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItemComponent, Item, ModalRef, ModalService} from '@spartacus/storefront';
import {FeatureConfigService, GlobalMessageService, ProductService, TranslationService} from '@spartacus/core';
import {TmaPlaceRole, TmaProcessTypeEnum, TmaRelatedPartyRole, TmaSubscribedProduct} from '../../../../model/tma-cart.model';
// import {TmaPremiseDetailsFormComponent} from '../../../premise-details/premise-details-form/tma-premise-details-form.component';
// import {TmaMeter, TmaPremiseDetail, TmaTechnicalResources} from '../../../../model/tma-premise-details.model';
import {Observable} from 'rxjs';
// import {TmaUserAddressService} from '../../../../features/user/facade/tma-user-address.service';
import {TmaCartService} from '../../../../features/cart/facade/tma-cart.service';
import {TmaCartPrice, TmaOrderEntry} from '../../../../model/tma-cart.entry.model';
// import {TmaPremiseDetailService} from '../../../../features/premisedetail/facade/tma-premise-detail.service';
// import {TmaInstallationAddressConverter} from '../../../../features/converters/tma-installation-address-converter';
import {TmaProduct} from '../../../../model/tma-product.model';
// import {TmaAddress} from '../../../../model/tma-address.model';
import {first} from 'rxjs/operators';

// import {TmaPremiseDetailInteractionService} from '../../../../features/premisedetail/facade/tma-premise-detail-interaction.service';

export interface TmaItem extends Item {
  entryNumber: number;
  subscribedProduct?: TmaSubscribedProduct;
  price?: TmaCartPrice;
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
  // premiseDetails: TmaPremiseDetail;
  modalRef: ModalRef;

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
    protected modalService: ModalService,
    protected cartService: TmaCartService,
    // protected tmaUserAddressService: TmaUserAddressService,
    // protected tmaPremiseDetailService: TmaPremiseDetailService,
    protected globalMessageService: GlobalMessageService,
    // protected installationAddressConverter: TmaInstallationAddressConverter,
    protected translationService: TranslationService,
    protected productService: ProductService,
    // protected premiseDetailInteractionService: TmaPremiseDetailInteractionService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.serviceProvider = this.getServiceProvider(this.item);
    this.product$ = this.productService.get(this.item.product.code);

    // this.product$.pipe(first(prod => prod != null)).subscribe(prod => this.premiseDetails = this.getPremiseDetails(prod));
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

  // updatePremiseDetails(
  //   {
  //     premiseDetails
  //   }: {
  //     premiseDetails: TmaPremiseDetail
  //   }): void {
  //   this.openModal(premiseDetails);
  // }

  // validatePremiseDetails(premiseDetails: TmaPremiseDetail): void {
  //   let validationResult = this.tmaPremiseDetailService.validatePremiseDetails(premiseDetails);
  //   validationResult.subscribe(vr => {
  //     if (this.checkPremiseValidity(vr)) {
  //       let orderEntry: TmaOrderEntry = {
  //         entryNumber: this.item.entryNumber,
  //         subscribedProduct: {
  //           characteristic: [
  //             {
  //               name: 'meter_id',
  //               value: premiseDetails.meter.id
  //             }
  //           ]
  //         }
  //       };
  //
  //       this.cartService.updateCartEntry(orderEntry);
  //       this.tmaUserAddressService.updateUserAddress(this.getAddressId(this.item), this.installationAddressConverter.convertSourceToTarget(premiseDetails.installationAddress));
  //       this.premiseDetails = premiseDetails;
  //       this.premiseDetailInteractionService.updatePremiseDetail({premiseDetails: this.premiseDetails, entryNumber: this.item.entryNumber});
  //     } else {
  //       this.translationService.translate('premiseDetails.premiseDetailsValidation.fail')
  //         .subscribe(translatedMessage => this.globalMessageService.add(translatedMessage, GlobalMessageType.MSG_TYPE_ERROR))
  //         .unsubscribe();
  //     }
  //
  //     this.modalRef.dismiss();
  //   });
  // }

  // protected checkPremiseValidity(validationResult: TmaTechnicalResources): boolean {
  //   return !!(validationResult.technicalResources && validationResult.technicalResources.find(vr => vr != ''));
  // }

  protected getServiceProvider(item: TmaItem): string {
    this.serviceProvider = item &&
    item.subscribedProduct &&
    item.subscribedProduct.relatedParty ? item.subscribedProduct.relatedParty.find(relatedParty => relatedParty.role == TmaRelatedPartyRole.SERVICE_PROVIDER).id : null;
    return this.serviceProvider;
  }

  protected getReasonForPurchase(): string {
    return this.serviceProvider ? 'switchProvider' : 'move';
  }

  // private openModal(premiseDetails: TmaPremiseDetail) {
  //   let modalInstance: any;
  //   this.modalRef = this.modalService.open(TmaPremiseDetailsFormComponent, {
  //     centered: true,
  //     size: 'lg',
  //   });
  //
  //   modalInstance = this.modalRef.componentInstance;
  //   modalInstance.premiseDetail = this.premiseDetails;
  //   modalInstance.isDialog = true;
  //   modalInstance.validatePremiseDetails.subscribe(($e) => {
  //     this.validatePremiseDetails($e.premiseDetails);
  //   });
  // }

  protected getAddressId(item: TmaItem): string {
    return item && item.subscribedProduct && item.subscribedProduct.place ? item.subscribedProduct.place.find(place => place.role == TmaPlaceRole.INSTALLATION_ADDRESS).id : '';
  }

  // protected getPremiseDetails(product: TmaProduct): TmaPremiseDetail {
  //   return this.premiseDetails ? this.premiseDetails : {
  //     installationAddress: this.installationAddressConverter.convertTargetToSource(this.getAddressFromItem(this.item)),
  //     meter: this.getMeter(product)
  //   };
  // }
  //
  // protected getAddressFromItem(item: TmaItem): TmaAddress {
  //   let place = item && item.subscribedProduct && item.subscribedProduct.place ? item.subscribedProduct.place.find(p => p.role == TmaPlaceRole.INSTALLATION_ADDRESS) : null;
  //
  //   return place ? {
  //     id: place.id,
  //     region: place.region,
  //     country: place.country,
  //     town: place.town,
  //     line1: place.line1,
  //     line2: place.line2,
  //     postalCode: place.postalCode
  //   } : null;
  //
  // }

  // protected getMeter(product: TmaProduct): TmaMeter {
  //   return this.item && this.item.subscribedProduct && this.item.subscribedProduct.characteristic ? {
  //       id: this.item.subscribedProduct.characteristic.find(ch => ch.name == 'meter_id').value,
  //       type: product.productSpecification.id,
  //     } :
  //     {
  //       id: '',
  //       type: ''
  //     };
  // }

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
    const tmaChildCartPrice = this.item.price.childPrices.find(cartPrice => cartPrice != null);
    if (tmaChildCartPrice) {
      return tmaChildCartPrice.taxIncludedAmount.formattedValue + ' ' + tmaChildCartPrice.billingTime.name;
    } else {
      return 'No price found';
    }
  }
}
