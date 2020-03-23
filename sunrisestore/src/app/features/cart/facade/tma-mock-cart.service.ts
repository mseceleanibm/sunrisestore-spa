import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CART_MODIFICATION_NORMALIZER, CartModification, ConverterService, OccEndpointsService} from "@spartacus/core";
import {cart} from "@spartacus/assets/translations/en/cart";
import {Observable, pipe} from "rxjs";
import {TmaOrderEntry} from "../../../model/tma-cart.entry.model";

@Injectable({
  providedIn: 'root'
})
export class TmaMockCartService {

  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService,
  ) {
  }

  removeEntry(baseSiteId: string, userId: string, cartId: string, entryNumber: number): Observable<CartModification> {
    console.log(this.occEndpointsService.getBaseEndpoint() + baseSiteId + '/users/' + userId + '/carts/' + cartId + '/entries/' + entryNumber)

    // return  this.http.delete(this.occEndpointsService.getBaseEndpoint() + baseSiteId + '/users/' + userId + '/carts/' + cartId + '/entries/' + entryNumber)
    //   .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));

    return null;
  }

  addEntry(entry: TmaOrderEntry, baseSiteId: string, userId: string, cartId: string): Observable<CartModification> {
    console.log(this.occEndpointsService.getBaseEndpoint() + baseSiteId + '/users/' + userId + '/carts/' + cartId + '/entries/');
    // return this.http.post(this.occEndpointsService.getBaseEndpoint() + baseSiteId + '/users/' + userId + '/carts/' + cartId + '/entries/', entry)
    //   .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));

    return null;
  }
}
