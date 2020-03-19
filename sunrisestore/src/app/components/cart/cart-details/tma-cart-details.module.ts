import {
  CartCouponModule,
  CartDetailsModule,
  PromotionsModule
} from '@spartacus/storefront';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CmsConfig, ConfigModule, FeaturesConfigModule, I18nModule, UrlModule} from '@spartacus/core';
import {TmaCartDetailsComponent} from './tma-cart-details.component';
import {TmaCartSharedModule} from '../cart-shared/tma-cart-shared.module';

@NgModule({
  imports: [
    TmaCartSharedModule,
    CommonModule,
    CartCouponModule,
    RouterModule,
    UrlModule,
    PromotionsModule,
    FeaturesConfigModule,
    ConfigModule.withConfig(<CmsConfig> {
      cmsComponents: {
        CartComponent: {
          component: TmaCartDetailsComponent,
        },
      },
    }),
    I18nModule,
  ],
  declarations: [TmaCartDetailsComponent],
  exports: [TmaCartDetailsComponent],
  entryComponents: [TmaCartDetailsComponent],
})
export class TmaCartDetailsModule extends CartDetailsModule {
}
