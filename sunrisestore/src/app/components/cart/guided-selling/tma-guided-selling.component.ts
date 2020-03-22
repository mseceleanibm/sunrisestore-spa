import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {GuidedSellingMock1} from "./tma-guided-selling-1.mock-data";
import {GuidedSellingMock2} from "./tma-guided-selling-2.mock-data";
import {ActivatedRoute} from "@angular/router";
import {TmaCartService} from "../../../features/cart/facade/tma-cart.service";
import {Cart, GlobalMessageService, GlobalMessageType, ProductService, User, UserService} from "@spartacus/core";
import {first} from "rxjs/operators";
import {TmaOrderEntry} from "../../../model/tma-cart.entry.model";
import {Observable} from "rxjs";
import {TmaProduct} from "../../../model/tma-product.model";
import {TmaProcessTypeEnum} from "../../../model/tma-cart.model";
import {TmaGuidedSellingInteractionService} from "../../../features/guided-selling/tma-guided-selling-interaction.service";

@Component({
  selector: 'cx-guided-selling',
  templateUrl: './tma-guided-selling.component.html',
  styleUrls: ['./tma-guided-selling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaGuidedSellingComponent implements OnInit {

  page: string;
  products: any;

  cartId: string;
  rootBpoCode: string;
  entryGroupNumber: number;

  activeUser: User;
  activeCart$: Observable<Cart>;
  items: TmaOrderEntry[];
  bpo: TmaProduct;

  constructor(
    protected route: ActivatedRoute,
    protected cartService: TmaCartService,
    protected userService: UserService,
    protected productService: ProductService,
    protected globalMessageService: GlobalMessageService,
    protected guidedSellingInteractionService: TmaGuidedSellingInteractionService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.cartId = params['cartId'];
      this.rootBpoCode = params['bpoId'];
      this.entryGroupNumber = params['entryGroupNumber'];

    });
  }

  ngOnInit(): void {
    this.page = '1';
    this.products = GuidedSellingMock1.products;
    this.userService.get().pipe(first((activeUser: User) => activeUser != null)).subscribe((activeUser: User) => this.activeUser = activeUser);
    this.activeCart$ = this.cartService.getActive();//.pipe(first((activeCart: Cart) => activeCart != null)).subscribe((activeCart: Cart) => this.activeCart = activeCart);
    this.productService.get(this.rootBpoCode).pipe(first((prod: TmaProduct) => prod != null)).subscribe((prod: TmaProduct) => this.bpo = prod);
  }

  switchPage(newPage: string) {
    this.page = newPage;
    switch (this.page) {
      case '1':
        this.products = GuidedSellingMock1.products;
        return;
      case '2':
        this.products = GuidedSellingMock2.products;
        return;
    }
  }

  changeSpoInBpo(productCode: string) {
    let keyWord = this.page == '1' ? 'freedom' : 'sim';

    let currentItem: TmaOrderEntry = this.items.find((item: TmaOrderEntry) => item.product.code.includes(keyWord));
    let newItemList: TmaOrderEntry[] = this.items;


    if (currentItem) {
      if (currentItem.product.code == productCode) {
        this.globalMessageService.add(currentItem.product.name + " already in the deal", GlobalMessageType.MSG_TYPE_INFO);
        return;
      }

      newItemList = this.items.filter((item: TmaOrderEntry) => item.entryNumber != currentItem.entryNumber);
      this.cartService.removeEntry(currentItem);
    }

    let newEntry: TmaOrderEntry = this.getCartEntry(productCode, this.rootBpoCode, this.entryGroupNumber);//, this.products.find((product: TmaProduct) => product.code == productCode));
    this.cartService.addCartEntry(newEntry, this.activeUser.uid);

    this.cartService.reloadActiveCart();
    this.cartService.getActive().pipe(first((activeCart: Cart) => activeCart != null)).subscribe((activeCart: Cart) => console.log(" $$$ ACTIVE: ", activeCart));

    newItemList.push(newEntry);

    this.guidedSellingInteractionService.updateGuidedSellingItems(newItemList);
  }

  protected getItems(cart: Cart): TmaOrderEntry[] {
    if (this.items && this.items.length != 0) {
      return this.items;
    }

    this.items = [];
    cart.entries.forEach((entry: TmaOrderEntry) => {
      let groupNr: number = entry.entryGroupNumbers[0] ? entry.entryGroupNumbers[0] : -1;
      if (groupNr == this.entryGroupNumber) {
        this.items.push(entry);
      }
    });

    return this.items;
  }

  protected getCartEntry(productCode: string, rootBpoCode: string, entryGroupNumber: number): TmaOrderEntry {
    return {
      entryGroupNumbers: [entryGroupNumber],
      processType: {id: TmaProcessTypeEnum.ACQUISITION},
      rootBpoCode: rootBpoCode,
      quantity: 1
    };
  }


}
