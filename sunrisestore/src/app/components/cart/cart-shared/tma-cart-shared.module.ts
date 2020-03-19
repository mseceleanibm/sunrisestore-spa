import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FeaturesConfigModule, I18nModule, UrlModule} from '@spartacus/core';
import * as fromTmaChecklistActionReducer from '../../../features/checklistaction/store/reducers/checklist-action.reducer';
import {CartCouponModule, CartSharedModule, ItemCounterModule, MediaModule, PromotionsModule, SpinnerModule} from '@spartacus/storefront';
import TmaCartItemComponent from './cart-item/tma-cart-item.component';
import TmaCartItemListComponent from './cart-item-list/tma-cart-item-list.component';
import {StoreModule} from '@ngrx/store';
import {tmaCartReducer} from '../../../features/cart/store/reducers/tma-cart.reducer';
import {EffectsModule} from '@ngrx/effects';
import {TmaCartEntryEffects} from '../../../features/cart/store/effects/tma-cart-entry.effect';
import {TmaChecklistActionEffect} from '../../../features/checklistaction/store/effects/tma-checklist-action.effect';
import {OrderSummaryComponent} from './order-summary/order-summary.component';
// import {TmaPurchaseReasonModule} from '../../purchase-reason/tma-purchase-reason.module';
// import {TmaPremiseDetailsModule} from '../../premise-details/tma-premise-details.module';


@NgModule({
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    CartCouponModule,
    ReactiveFormsModule,
    UrlModule,
    NgbModule,
    PromotionsModule,
    I18nModule,
    MediaModule,
    ItemCounterModule,
    FeaturesConfigModule,
    StoreModule.forFeature('tmaCartReducer', tmaCartReducer),
    StoreModule.forFeature('checklistActionReducer', fromTmaChecklistActionReducer.checklistActionReducer),
    EffectsModule.forFeature([TmaCartEntryEffects, TmaChecklistActionEffect]),
    // TmaPurchaseReasonModule,
    // TmaPremiseDetailsModule,
    SpinnerModule,
  ],
  declarations: [
    TmaCartItemComponent,
    TmaCartItemListComponent,
    OrderSummaryComponent,
  ],
  exports: [TmaCartItemComponent, TmaCartItemListComponent, OrderSummaryComponent],
})
export class TmaCartSharedModule extends CartSharedModule {
}
