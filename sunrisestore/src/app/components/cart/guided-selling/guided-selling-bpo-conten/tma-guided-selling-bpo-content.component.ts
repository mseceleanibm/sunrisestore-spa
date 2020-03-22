import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {TmaOrderEntry} from "../../../../model/tma-cart.entry.model";
import {TmaProduct} from "../../../../model/tma-product.model";
import {TmaGuidedSellingInteractionService} from "../../../../features/guided-selling/tma-guided-selling-interaction.service";
import {Observable} from "rxjs";

@Component({
  selector: 'cx-guided-selling-bpo-content',
  templateUrl: './tma-guided-selling-bpo-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaGuidedSellingBpoContentComponent implements OnInit {

  @Input()
  items: TmaOrderEntry[];

  guidedSellingItems$: Observable<TmaOrderEntry[]>;

  @Input()
  bpo: TmaProduct;

  constructor(
    protected guidedSellingInteractionService: TmaGuidedSellingInteractionService,
  ) {
  }

  ngOnInit(): void {
    this.guidedSellingItems$ = this.guidedSellingInteractionService.guidedSellingItems$;
  }

  protected getPrice(item: TmaOrderEntry): string {
    const tmaChildCartPrice = item.cartPrice.cartPrice.find(cartPrice => cartPrice != null);
    if (tmaChildCartPrice) {
      return tmaChildCartPrice.taxIncludedAmount.value + ' ' + tmaChildCartPrice.taxIncludedAmount.currencyIso + ' /' + tmaChildCartPrice.recurringChargePeriod;
    }
  }
}
