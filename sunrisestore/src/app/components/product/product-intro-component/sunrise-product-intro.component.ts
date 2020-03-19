import {CurrentProductService, ProductIntroComponent} from '@spartacus/storefront';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslationService, WindowRef} from '@spartacus/core';

@Component({
  selector: 'cx-product-intro',
  templateUrl: './sunrise-product-intro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunriseProductIntroComponent extends ProductIntroComponent {

  constructor(currentProductService: CurrentProductService, translationService: TranslationService, winRef: WindowRef, ) {
    super(currentProductService, translationService, winRef);
  }

}
