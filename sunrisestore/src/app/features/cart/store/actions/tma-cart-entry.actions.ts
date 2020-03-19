import {CART_DATA, StateLoaderActions} from '@spartacus/core';

export enum TmaCartEntryActionTypes {
  UPDATE_CONTRACT_START_DATE = '[Cart-entry] Update Contract Start Date',
  UPDATE_CONTRACT_START_DATE_SUCCESS = '[Cart-entry] Update Contract Start Date Success',
  UPDATE_CONTRACT_START_DATE_FAIL = '[Cart-entry] Update Contract Start Date Fail',
  UPDATE_PROVIDER = '[Cart-entry] Update Provider',
  UPDATE_PROVIDER_SUCCESS = '[Cart-entry] Update Provider Success',
  UPDATE_PROVIDER_FAIL = '[Cart-entry] Update Provider Fail',
  ADD_CART_ENTRY = '[Cart-entry] Add Cart Entry',
  ADD_CART_ENTRY_SUCCESS = '[Cart-entry] Add Cart Entry Success',
  ADD_CART_ENTRY_FAIL = '[Cart-entry] Add Cart Entry Fail',
  UPDATE_CART_ENTRY = '[Cart-entry] Update Cart Entry',
  UPDATE_CART_ENTRY_SUCCESS = '[Cart-entry] Update Cart Entry Success',
  UPDATE_CART_ENTRY_FAIL = '[Cart-entry] Update Cart Entry Fail',
}

export class AddCartEntry extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class AddCartEntrySuccess extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class AddCartEntryFail extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateCartEntry extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}
export class UpdateCartEntrySuccess extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}
export class UpdateCartEntryFail extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}
export class UpdateContractStartDate extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateContractStartDateSuccess extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateContractStartDateFail extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE_FAIL;

  constructor(public payload: Error) {
    super(CART_DATA);
  }
}

export class UpdateProvider extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_PROVIDER;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateProviderSuccess extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_PROVIDER_SUCCESS;

  constructor(public payload: any) {
    super(CART_DATA);
  }
}

export class UpdateProviderFail extends StateLoaderActions.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_PROVIDER_FAIL;

  constructor(public payload: Error) {
    super(CART_DATA);
  }
}

export type TmaCartActionType =
  | UpdateContractStartDate
  | UpdateContractStartDateSuccess
  | UpdateContractStartDateFail
  | UpdateProvider
  | UpdateProviderSuccess
  | UpdateProviderFail
  | AddCartEntry
  | AddCartEntrySuccess
  | AddCartEntryFail
  | UpdateCartEntry
  | UpdateCartEntrySuccess
  | UpdateCartEntryFail;
