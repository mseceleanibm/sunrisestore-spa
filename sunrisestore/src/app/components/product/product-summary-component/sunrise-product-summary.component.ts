import {CurrentProductService, ProductSummaryComponent} from '@spartacus/storefront';
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'cx-product-summary',
  templateUrl: './sunrise-product-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunriseProductSummaryComponent extends ProductSummaryComponent {
  constructor(currentProductService: CurrentProductService) {
    super(currentProductService);
  }
}
