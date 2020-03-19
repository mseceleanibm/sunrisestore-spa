import {InjectionToken} from '@angular/core';
import {TmaCartModification} from '../../../model/tma-cart.model';
import {Converter} from '@spartacus/core';
import {TmaChecklistAction} from '../../../model/tma-checklist-action.model';
// import {TmaTechnicalResource} from '../../../model/tma-premise-details.model';

export const TMA_CART_MODIFICATION_NORMALIZER = new InjectionToken<Converter<any, TmaCartModification>>('TmaCartModificationNormalizer');

export const TMA_CHECKLIST_ACTION_NORMALIZER = new InjectionToken<Converter<any, TmaChecklistAction>>('TmaChecklistActionNormalizer');

// export const TMA_TECHNICAL_RESOURCE_NORMALIZER = new InjectionToken<Converter<any, TmaTechnicalResource>>('TmaTechnicalResourceNormalizer');
