import {Component, Input} from '@angular/core';
import {Cart} from '@spartacus/core';

@Component({
  selector: 'cx-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent {
  @Input()
  cart: Cart;

  getMonthlyTotalPrice(price: any, billingTimeCode: string, priceType: string) {
    let monthlyPrice;
    if (price) {
      for (let childPrice of price.childPrices) {
        if (childPrice.billingTime) {
          if (childPrice.billingTime.code === billingTimeCode && childPrice.typeOfPrice === priceType) {
            console.log("Found it! " + childPrice.taxIncludedAmount.value);
            return childPrice.taxIncludedAmount;
          }
        } else if (childPrice.childPrices) {
          monthlyPrice = this.getMonthlyTotalPrice(childPrice, billingTimeCode, priceType);
        }
        if (monthlyPrice) return monthlyPrice;
      }
    } else {
      return '';
    }
  }

}
