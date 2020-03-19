import {CartOccModule} from '@spartacus/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {TmaOccCartEntryAdapter} from './tma-occ-cart-entry.adapter';
import {NgModule} from '@angular/core';
import {TmaCartEntryAdapter} from '../../../features/cart/store/adapters/tma-cart-entry.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter,
    }
  ]
})
export class TmaOccCartModule extends CartOccModule {
}
