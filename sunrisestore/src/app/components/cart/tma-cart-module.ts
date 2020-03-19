import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {TmaCartDetailsModule} from './cart-details/tma-cart-details.module';
import {TmaCartSharedModule} from './cart-shared/tma-cart-shared.module';
import {
  AddToCartModule,
  CartComponentModule,
  CartPageLayoutHandler,
  CartTotalsModule,
  MiniCartModule,
  PAGE_LAYOUT_HANDLER
} from '@spartacus/storefront';
import {CartModule} from '@spartacus/core';
import {TmaActiveCartService} from '../../features/cart/facade/tma-active-cart.service';
import {TmaMultiCartService} from '../../features/cart/facade/tma-multi-cart.service';

@NgModule({
  imports: [
    NgbModule,
    // TmaCartDetailsModule,
    CartTotalsModule,
    TmaCartSharedModule
    // ConfigModule.withConfig(<CmsConfig>{
    //   cmsComponents: {
    //     CartTotalsComponent: {
    //       component: null,
    //     },
    // }),
  ],
  exports: [
    // TmaCartDetailsModule,
    CartTotalsModule,
    TmaCartSharedModule,
    AddToCartModule,
    MiniCartModule,
    CartModule,
  ],
  declarations: [],
  providers: [
    TmaActiveCartService,
    TmaMultiCartService,
    {
      provide: PAGE_LAYOUT_HANDLER,
      useExisting: CartPageLayoutHandler,
      multi: true,
    },
  ],
})
export class TmaCartComponentModule extends CartComponentModule {

}
