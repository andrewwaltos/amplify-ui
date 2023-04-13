import { CommonRouteSelectorKeys, RouteSelectorKeys } from './types';

const COMMON_SELECTOR_KEYS: CommonRouteSelectorKeys[] = [
  'error',
  'isPending',
  'setNavigableRoute',
  'submitForm',
  'updateBlur',
  'updateForm',
];

export const ROUTE_SELECTOR_KEYS: RouteSelectorKeys = {
  confirmResetPassword: [
    ...COMMON_SELECTOR_KEYS,
    'resendCode',
    'validationErrors',
  ],
  confirmSignIn: [...COMMON_SELECTOR_KEYS, 'toSignIn', 'user'],
  confirmSignUp: [...COMMON_SELECTOR_KEYS, 'codeDeliveryDetails', 'resendCode'],
  confirmVerifyUser: [...COMMON_SELECTOR_KEYS, 'skipVerification'],
  forceNewPassword: [...COMMON_SELECTOR_KEYS, 'toSignIn', 'validationErrors'],
  resetPassword: [...COMMON_SELECTOR_KEYS, 'toSignIn'],
  setupTOTP: [...COMMON_SELECTOR_KEYS, 'toSignIn', 'totpSecretCode'],
  signIn: [
    ...COMMON_SELECTOR_KEYS,
    'toFederatedSignIn',
    'toResetPassword',
    'toSignUp',
  ],
  signUp: [...COMMON_SELECTOR_KEYS, 'toSignIn', 'validationErrors'],
  verifyUser: [...COMMON_SELECTOR_KEYS, 'skipVerification'],
};
