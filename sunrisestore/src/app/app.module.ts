import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {translationChunksConfig, translations} from '@spartacus/assets';
import {SunriseProductIntroModule} from './components/product/product-intro-component/sunrise-product-intro.module';
import {SunriseProductSummaryModule} from './components/product/product-summary-component/sunrise-product-summary.module';
import {TmaAddToCartModule} from './components/cart/add-to-cart/tma-add-to-cart.module';
import {TmaCartSharedModule} from './components/cart/cart-shared/tma-cart-shared.module';
import {TmaOccCartModule} from './occ/adapters/cart/tma-occ-cart.module';
import {TmaB2cStorefrontModule} from './storefrontlib/src/recipes/tma-b2c-storefront.module';
import {TmfModule} from './tmf/tmf.module';
import {TmaAuthModule} from './auth/tma-auth-module';
import {TmaCartComponentModule} from './components/cart/tma-cart-module';
import {TmaCartDetailsModule} from './components/cart/cart-details/tma-cart-details.module';
import {CartTotalsModule} from './components/cart/cart-totals/cart-totals.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TmaB2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/rest/v2/',
          endpoints: {
            product_scopes: {
              details:
                'products/${productCode}?fields=averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags,images(FULL),productOfferingPrice(FULL),productSpecification,validFor,preconfigSpos',
            },
          }
        },
        tmf: {
          baseUrl: 'https://localhost:9002',
          prefix: '/b2ctelcotmfwebservices/v2/',
        }
      },
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['utilitiesspa',
          'media',
          'utilities',
          'b2ctelco']
      },

      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      features: {
        level: '1.4'
      }
    }),
    SunriseProductIntroModule,
    SunriseProductSummaryModule,
    TmaOccCartModule,
    TmaAddToCartModule,
    TmaCartSharedModule,
    TmaCartComponentModule,
    TmaCartDetailsModule,
    CartTotalsModule,
    TmaAuthModule,
    TmfModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
