import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CmsConfig, ConfigModule, I18nModule, UrlModule} from '@spartacus/core';
import {CartTotalsComponent} from './cart-totals.component';
import {CartCouponModule} from '@spartacus/storefront';
import {TmaCartSharedModule} from '../cart-shared/tma-cart-shared.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig(<CmsConfig> {
      cmsComponents: {
        CartTotalsComponent: {
          component: CartTotalsComponent,
        },
      },
    }),
    TmaCartSharedModule,
    I18nModule,
    CartCouponModule,
  ],
  declarations: [CartTotalsComponent],
  exports: [CartTotalsComponent],
  entryComponents: [CartTotalsComponent],
})
export class CartTotalsModule {
}
