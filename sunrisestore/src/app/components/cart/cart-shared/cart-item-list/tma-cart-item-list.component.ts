import {Component, Input} from '@angular/core';
import {CartItemListComponent} from '@spartacus/storefront';
import {FeatureConfigService, ProductService} from '@spartacus/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TmaCartService} from '../../../../features/cart/facade/tma-cart.service';
import {Router} from "@angular/router";
import {TmaItem} from "../cart-item/tma-cart-item.component";
import {first} from "rxjs/operators";
import {TmaProduct} from "../../../../model/tma-product.model";

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html',
  styleUrls: ['./tma-cart-item-list.component.scss']
})
export default class TmaCartItemListComponent extends CartItemListComponent {
  form: FormGroup = this.fb.group({});

  @Input()
  cartId: string;

  groupedItems;

  protected underscore_regexp = /_/gi;

  constructor(
    protected tmaCartService: TmaCartService,
    protected fb: FormBuilder,
    protected featureConfig: FeatureConfigService,
    protected router: Router,
    protected productService: ProductService,
  ) {
    super(tmaCartService, fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.groupedItems = this.getGroupedItems(<TmaItem[]>this.items);
  }

  isSaveForLaterEnabled(): boolean {
    if (this.featureConfig) {
      return this.featureConfig.isEnabled('saveForLater');
    }
    return false;
  }

  editItem(bpoId: string, entryGroupNumber: number) {
    this.router.navigate([`/bpo/configure`], {
      queryParams: {
        ['cartId']: this.cartId,
        ['bpoId']: bpoId,
        ['entryGroupNumber']: entryGroupNumber
      }
    });
  }

  removeEntry(item: TmaItem): void {

    this.tmaCartService.removeEntry(item);
    delete this.form.controls[item.product.code];

    this.removeItemFromGroup(item);
  }


  protected getGroupedItems(items: TmaItem[]) {
    let groups = new Array();
    for (let item of items) {
      let groupNr: number = item.entryGroupNumbers[0] ? item.entryGroupNumbers[0] : -1;
      if (!groups[groupNr]) {
        groups[groupNr] = [];
      }

      groups[groupNr].push(item);

    }
    return groups;
  }

  protected removeItemFromGroup(item: TmaItem): void {
    let groupNr: number = item.entryGroupNumbers[0] ? item.entryGroupNumbers[0] : -1;

    this.groupedItems[groupNr] = this.groupedItems[groupNr].filter(it => it.entryNumber != item.entryNumber);
  }

  protected getBpoName(bpoCode: string): string {
    let bpo: TmaProduct;
    this.productService.get(bpoCode).pipe(first((prod: TmaProduct) => prod != null)).subscribe((prod: TmaProduct) => bpo = prod);
    return bpo ? bpo.name : '';
  }
}
