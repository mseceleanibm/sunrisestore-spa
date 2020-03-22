import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MediaModule, SpinnerModule, StarRatingModule} from "@spartacus/storefront";
import {TmaCgsProductGridComponent} from "./tma-cgs-product-grid.component";
import {FeaturesConfigModule, I18nModule, UrlModule} from "@spartacus/core";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    FeaturesConfigModule,
    UrlModule,
    I18nModule,
    MediaModule,
    StarRatingModule,
  ],
  declarations: [TmaCgsProductGridComponent],
  entryComponents: [TmaCgsProductGridComponent],
  exports: [TmaCgsProductGridComponent],
})
export class TmaCgsProductGridModule {
}
