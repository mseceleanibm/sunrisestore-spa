import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'cx-cgs-product-grid-item',
  templateUrl: './tma-cgs-product-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCgsProductGridComponent {
  @Input()
  product: any;

  @Output()
  changeSpoInBpo = new EventEmitter<any>();

  constructor() {

  }

  select(productCode: string) {
    this.changeSpoInBpo.emit(productCode);
  }
}
