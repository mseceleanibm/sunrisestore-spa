import {SunriseProductSummaryComponent} from './sunrise-product-summary.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from '@spartacus/core';
import {ProductSummaryModule, StarRatingModule} from '@spartacus/storefront';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StarRatingModule,
    ConfigModule.withConfig(<CmsConfig> {
      cmsComponents: {
        ProductSummaryComponent: {
          component: SunriseProductSummaryComponent,
        },
      },
    }),
  ],
  declarations: [SunriseProductSummaryComponent],
  exports: [SunriseProductSummaryComponent],
  entryComponents: [SunriseProductSummaryComponent],
})

export class SunriseProductSummaryModule extends ProductSummaryModule {
}
