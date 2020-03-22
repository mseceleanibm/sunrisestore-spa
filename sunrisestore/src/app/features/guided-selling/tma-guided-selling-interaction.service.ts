import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {TmaOrderEntry} from "../../model/tma-cart.entry.model";

@Injectable({
  providedIn: 'root'
})
export class TmaGuidedSellingInteractionService {
  protected _guidedSellingItems = new Subject<TmaOrderEntry[]>();
  guidedSellingItems$ = this._guidedSellingItems.asObservable();

  constructor() {
  }

  updateGuidedSellingItems(gsItems: TmaOrderEntry[]) {
    this._guidedSellingItems.next(gsItems);
  }
}
