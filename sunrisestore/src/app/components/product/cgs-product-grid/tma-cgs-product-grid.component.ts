import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Media, MediaService} from "@spartacus/storefront";
import {TmaProduct} from "../../../model/tma-product.model";
import {ProductService} from "@spartacus/core";
import {Observable} from "rxjs";

@Component({
  selector: 'cx-cgs-product-grid-item',
  templateUrl: './tma-cgs-product-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCgsProductGridComponent implements OnInit {
  @Input()
  product: any;

  @Output()
  changeSpoInBpo = new EventEmitter<any>();

  productDb$: Observable<TmaProduct>;

  constructor(
    protected productService: ProductService
  ) {
  }

  ngOnInit(): void {
    this.productDb$ = this.productService.get(this.product.code);

  }

  select(product: TmaProduct) {
    this.changeSpoInBpo.emit(product);
  }


}
