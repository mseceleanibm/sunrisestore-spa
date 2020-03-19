import {CartDetailsComponent} from '@spartacus/storefront';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TmaCartService} from '../../../features/cart/facade/tma-cart.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './tma-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCartDetailsComponent extends CartDetailsComponent {

  constructor(protected tmaCartService: TmaCartService) {
    super(tmaCartService);
  }

  ngOnInit(): void {
    //super.ngOnInit();
    this.tmaCartService.loadCart();
    this.cart$ = this.tmaCartService.getActive();

    this.entries$ = this.tmaCartService
      .getEntries()
      .pipe(filter(entries => entries.length > 0));

    this.cartLoaded$ = this.tmaCartService.getLoaded();

  }

}
