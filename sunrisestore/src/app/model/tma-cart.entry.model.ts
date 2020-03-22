import {OrderEntry, Region} from '@spartacus/core';
import {TmaProcessType, TmaSubscribedProduct} from './tma-cart.model';

export enum TmaActionTypeEnum {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
}

export interface TmaDuration {
  amount?: number;
  units?: string;
}

export interface TmaBillingPlan {
  billingCycleDay?: number;
  billingCycleType?: string;
  billingTime?: string;
  name?: string;
}

export interface TmaSubscriptionTerm {
  billingPlan?: TmaBillingPlan;
  id?: string;
  name?: string;
  duration?: TmaDuration;
  termOfServiceFrequency?: string;
  termOfServiceNumber?: number;
  termOfServiceRenewal?: string;
  cancellable?: boolean;
}

export interface TmaOrderEntry extends OrderEntry {
  action?: TmaActionTypeEnum;
  appointmentId?: string;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
  subscriptionTerm?: TmaSubscriptionTerm;
  contractStartDate?: string;
  entryGroupNumbers?: number[];
  region?: Region;
  rootBpoCode?: string;
  cartPrice?: TmaCartPrice;
}

export interface TmaCartPrice {
  childPrices?: TmaChildCartPrice[],
}

export interface TmaChildCartPrice {
  taxIncludedAmount?: TmaTaxIncludedAmount,
  billingTime?: TmaBillingTime,
}

export interface TmaTaxIncludedAmount {
  value?: string,
  currencyIso?: string,
  formattedValue?: string,
}

export interface TmaBillingTime {
  name?: string,
}
