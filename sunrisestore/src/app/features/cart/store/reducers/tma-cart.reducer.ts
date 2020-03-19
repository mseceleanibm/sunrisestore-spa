import {CartState} from '@spartacus/core';
import {TmaCartActionType, TmaCartEntryActionTypes} from '../actions/tma-cart-entry.actions';

export const initialState: CartState = {
  content: {},
  entries: {},
  refresh: false,
  cartMergeComplete: false,
};

export function tmaCartReducer(
  state = initialState,
  action: TmaCartActionType
): CartState {
  switch (action.type) {
    case TmaCartEntryActionTypes.UPDATE_PROVIDER_SUCCESS:
    case TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE_SUCCESS:
    case TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS:
    case TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS: {
      return {
        ...state,
        refresh: true,
      };
    }
    case TmaCartEntryActionTypes.UPDATE_PROVIDER_FAIL:
    case TmaCartEntryActionTypes.UPDATE_CONTRACT_START_DATE_FAIL:
    case TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL:
    case TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL: {
      return {
        ...state,
        refresh: true
      };
    }
  }

  return state;
}
