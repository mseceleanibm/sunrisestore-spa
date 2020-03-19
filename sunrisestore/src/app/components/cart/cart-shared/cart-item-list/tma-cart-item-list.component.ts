import {Component} from '@angular/core';
import {CartItemListComponent} from '@spartacus/storefront';
import {FeatureConfigService} from '@spartacus/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TmaCartService} from '../../../../features/cart/facade/tma-cart.service';

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html'
})
export default class TmaCartItemListComponent extends CartItemListComponent {
  form: FormGroup = this.fb.group({});

  constructor(
    protected tmaCartService: TmaCartService,
    protected fb: FormBuilder,
    protected featureConfig: FeatureConfigService
  ) {
    super(tmaCartService, fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  isSaveForLaterEnabled(): boolean {
    if (this.featureConfig) {
      return this.featureConfig.isEnabled('saveForLater');
    }
    return false;
  }

  updateStartDateForEntry(
    {
      item,
      contractStartDate
    }: {
      item: any;
      contractStartDate: string;
    }): void {
    // this.tmaCartService.updateContractStartDate(item.entryNumber, contractStartDate);
  }

  updateCurrentProvider(
    {
      item,
      provider
    }: {
      item: any;
      provider: string;
    }): void {
    this.tmaCartService.updateProvider(item.entryNumber, provider);
  }
}
