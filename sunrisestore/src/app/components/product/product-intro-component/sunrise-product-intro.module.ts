import {SunriseProductIntroComponent} from './sunrise-product-intro.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmsConfig, ConfigModule, I18nModule} from '@spartacus/core';
import {ProductIntroModule, StarRatingModule} from '@spartacus/storefront';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StarRatingModule,
    ConfigModule.withConfig(<CmsConfig> {
      cmsComponents: {
        ProductIntroComponent: {
          component: SunriseProductIntroComponent,
        },
      },
    }),
  ],
  declarations: [SunriseProductIntroComponent],
  exports: [SunriseProductIntroComponent],
  entryComponents: [SunriseProductIntroComponent],
})

export class SunriseProductIntroModule extends ProductIntroModule {
}
