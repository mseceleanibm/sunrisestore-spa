import {AddedToCartDialogComponent, ModalService} from '@spartacus/storefront';
import {Component, Input} from '@angular/core';
import {TmaCartService} from '../../../../features/cart/facade/tma-cart.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {TmaOrderEntry} from '../../../../model/tma-cart.entry.model';
import {Cart} from "@spartacus/core";

@Component({
  selector: 'cx-added-to-cart-dialog',
  templateUrl: './tma-added-to-cart-dialog.component.html',
})
export class TmaAddedToCartDialogComponent extends AddedToCartDialogComponent {

  @Input()
  backupEntry: TmaOrderEntry;

  @Input()
  backupCart: Cart;

  constructor(
    protected modalService: ModalService,
    protected cartService: TmaCartService,
    protected fb: FormBuilder
  ) {
    super(modalService, cartService, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.entry$ = this.entry$.pipe(
      tap(entry => {
        if (entry) {
          const {code} = entry.product;
          if (!this.form.controls[code]) {
            this.form.setControl(code, this.createCartEntryFormGroup(entry));
          } else {
            const entryForm = this.form.controls[code] as FormGroup;
            entryForm.controls.quantity.setValue(entry.quantity);
          }
          this.form.markAsPristine();
          if (!this.modalIsOpen) {
            this.modalIsOpen = true;
          }
        }
      })
    );
  }

  dismissModal(reason?: any): void {
    this.cartService.loadCart();
    this.modalService.dismissActiveModal(reason);
  }

  removeEntry(item: TmaOrderEntry): void {
    this.cartService.removeEntry(item);
    delete this.form.controls[item.product.code];
    this.dismissModal('Removed');
  }

  updateEntry({item, updatedQuantity}): void {
    this.cartService.updateEntry(item.entryNumber, updatedQuantity);
  }

  protected createCartEntryFormGroup(entry: TmaOrderEntry): FormGroup {
    return this.fb.group({
      entryNumber: entry.entryNumber,
      quantity: entry.quantity,
    });
  }
}
