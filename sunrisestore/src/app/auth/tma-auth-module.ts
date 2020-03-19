import {AuthConfig, AuthModule, Config} from '@spartacus/core';
import {tmaInterceptors} from './http-interceptors';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class TmaAuthModule extends AuthModule {
  static forRoot(): ModuleWithProviders<TmaAuthModule> {
    return {
      ngModule: TmaAuthModule,
      providers: [
        ...tmaInterceptors,
        {provide: AuthConfig, useExisting: Config},
      ],
    };
  }
}
