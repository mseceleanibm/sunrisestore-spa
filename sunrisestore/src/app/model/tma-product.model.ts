import {Product} from '@spartacus/core';

export interface TmaProduct extends Product {
  productSpecification?: TmaProductSpecification,
  preconfigSpos?: TmaProduct[],
  productOfferingPrice?: TmaProductOfferingPrice[],
}

export interface TmaProductSpecification {
  id: string,
  name?: string,
  href?: string,
}

export interface TmaProductOfferingPrice {
  bundlePop: TmaBundledPop
}

export interface TmaBundledPop {
  chargeType: string,
  price: TmaPriceValue
}

interface TmaPriceValue {
  value: string,
  currencyIso: string
}
