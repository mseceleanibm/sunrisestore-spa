import {CartModification, Country, Region} from '@spartacus/core';
import {TmaOrderEntry} from './tma-cart.entry.model';

export interface TmaCartModification extends CartModification {
  deliveryModeChanged?: boolean;
  entry?: TmaOrderEntry;
  quantity?: number;
  quantityAdded?: number;
  statusCode?: string;
  statusMessage?: string;
  contractStartDate?: string;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
}

export interface TmaProcessType {
  id: TmaProcessTypeEnum;
}

export enum TmaProcessTypeEnum {
  ACQUISITION = 'ACQUISITION',
  DEVICE_ONLY = 'DEVICE_ONLY',
  RETENTION = 'RETENTION',
  SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
  TARIFF_CHANGE = 'TARIFF_CHANGE',
}

export enum TmaRelatedPartyRole {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export enum TmaPlaceRole {
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS',
}

export interface TmaCharacteristic {
  name?: string;
  value?: string;
}

export interface TmaSubscribedProduct {
  relatedParty?: TmaRelatedParty[];
  place?: TmaPlace[];
  characteristic?: TmaCharacteristic[];
}

export interface TmaRelatedParty {
  id?: string;
  role?: TmaRelatedPartyRole;
}

export interface TmaPlace {
  id?: string;
  name?: string;
  role?: TmaPlaceRole;
  country?: Country;
  region?: Region;
  line1?: string;
  line2?: string;
  town?: string;
  postalCode?: string;
}
