import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MediaModule, ProductListModule, SpinnerModule} from "@spartacus/storefront";
import {CmsConfig, ConfigModule, FeaturesConfigModule, I18nModule, UrlModule} from "@spartacus/core";
import {TmaGuidedSellingComponent} from "./tma-guided-selling.component";
import {TmaCgsProductGridModule} from "../../product/cgs-product-grid/tma-cgs-product-grid.module";
import {TmaGuidedSellingBpoContentComponent} from "./guided-selling-bpo-conten/tma-guided-selling-bpo-content.component";
import {TmaActiveCartService} from "../../../features/cart/facade/tma-active-cart.service";
import {TmaMockCartService} from "../../../features/cart/facade/tma-mock-cart.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    FeaturesConfigModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        GuidedSellingComponent: {
          component: TmaGuidedSellingComponent,
        },
      },
    }),
    UrlModule,
    I18nModule,
    ProductListModule,
    TmaCgsProductGridModule,
    MediaModule,
  ],
  declarations: [TmaGuidedSellingComponent, TmaGuidedSellingBpoContentComponent],
  entryComponents: [TmaGuidedSellingComponent, TmaGuidedSellingBpoContentComponent],
  exports: [TmaGuidedSellingComponent, TmaGuidedSellingBpoContentComponent],
  providers: [TmaMockCartService]
})
export class TmaGuidedSellingModule {
}
