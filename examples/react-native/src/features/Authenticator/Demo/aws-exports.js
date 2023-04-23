const awsmobile = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id:
    'us-east-2:a9a40029-4168-4900-a303-dc6bf13b8186',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_w41siCOub',
  aws_user_pools_web_client_id: '3av6jn39ch7q300d7bl4o5ftp1',
  oauth: {},
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      'REQUIRES_LOWERCASE',
      'REQUIRES_NUMBERS',
      'REQUIRES_SYMBOLS',
      'REQUIRES_UPPERCASE',
    ],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
};

export default awsmobile;
