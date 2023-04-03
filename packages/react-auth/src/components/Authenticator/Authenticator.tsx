import * as React from 'react';
import {
  AuthenticatorMachineOptions,
  AuthenticatorRoute,
  AmplifyUser,
  configureComponent,
  isFunction,
  RequiredDeep,
} from '@aws-amplify/ui';

import {
  AuthenticatorProvider as Provider,
  useAuthenticator,
  UseAuthenticator,
  useAuthenticatorProps,
  UseAuthenticatorProps,
  useAuthenticatorInitMachine,
  AuthenticatorRouteComponentKey,
} from '@aws-amplify/ui-react-core-auth';

import { Heading, Flex, View } from '@aws-amplify/ui-react';

import { VERSION } from '../../version';

import {
  FieldOptions,
  Fields as DefaultFields,
  Form as DefaultForm,
  FormComponent,
  SubmitButton as DefaultSubmitButton,
  SubmitButtonComponent,
} from './Form';
import { ErrorView as DefaultErrorView, ErrorViewComponent } from './ErrorView';
import { LinkButtons, LinkButtonsProps } from './LinkButtons';
import { getDefaultFields } from './utils';

// @todo Should be: fields?: (FieldOptions & Omit<FieldControlProps, 'children'>)[];
// below is missing validate prop
export type Fields = Partial<
  Record<
    AuthenticatorRouteComponentKey,
    FieldOptions[] | ((fields: FieldOptions[]) => FieldOptions[])
  >
>;

type GetDisplayTextKey = `get${string}Text`;
type DisplayTextKey = `${string}Text`;

type DisplayText<T extends Record<GetDisplayTextKey | DisplayTextKey, any>> = {
  [K in keyof T]: K extends GetDisplayTextKey
    ? (value: Parameters<T[K]>[0]) => string
    : K extends DisplayTextKey
    ? string
    : never;
};

type CommmonDisplayText = {
  headingText?: string;
  submitButtonText?: string;
};
type SignInDisplayText = DisplayText<{
  linkResetPasswordText?: string;
  linkSignUpText?: string;
}> &
  CommmonDisplayText;
type ResetPasswordDisplayText = DisplayText<{
  linkSignInText?: string;
}> &
  CommmonDisplayText;
type SignUpDisplayText = DisplayText<{
  linkSignInText?: string;
}> &
  CommmonDisplayText;

// prop
type AuthenticatorDisplayText = {
  resetPassword?: ResetPasswordDisplayText;
  signIn?: SignInDisplayText;
  signUp?: SignUpDisplayText;
};

type DefaultAuthenticatorDisplayText = RequiredDeep<AuthenticatorDisplayText>;

export const defaultDisplayText: DefaultAuthenticatorDisplayText = {
  resetPassword: {
    headingText: 'Reset Password',
    linkSignInText: 'Sign In',
    submitButtonText: 'Send Code',
  },
  signIn: {
    headingText: 'Sign In',
    linkResetPasswordText: 'Forgot Password',
    linkSignUpText: 'Create Account',
    submitButtonText: 'Sign In',
  },
  signUp: {
    headingText: 'Create Account',
    linkSignInText: 'Sign In',
    submitButtonText: 'Create Account',
  },
};

export type SignOut = UseAuthenticator['signOut'];
export type AuthenticatorProps = Partial<AuthenticatorMachineOptions> & {
  children?:
    | React.ReactNode
    | ((props: { signOut?: SignOut; user?: AmplifyUser }) => JSX.Element);
  displayText?: AuthenticatorDisplayText;
  // fields?: Fields;
  Form?: FormComponent;
  ErrorView?: ErrorViewComponent;
  SubmitButton?: SubmitButtonComponent;
  variation?: 'default' | 'modal';
};

interface UIProps {
  buttons?: LinkButtonsProps['buttons'];
  headingText?: string;
  isPending: boolean;
  submitButtonText: string;
}

function getProps<Route extends AuthenticatorRoute>({
  displayText,
  props,
  route,
}: {
  displayText: DefaultAuthenticatorDisplayText;
  props: UseAuthenticatorProps<Route>;
  route: Route;
}): UIProps | null {
  switch (route) {
    case 'resetPassword': {
      const { isPending, setNavigableRoute } =
        props as UseAuthenticatorProps<'resetPassword'>;
      const { headingText, linkSignInText, submitButtonText } =
        displayText.resetPassword;

      const buttons: LinkButtonsProps['buttons'] = [
        {
          children: linkSignInText,
          key: 'signIn',
          onClick: () => setNavigableRoute('signIn'),
        },
      ];

      return { headingText, isPending, buttons, submitButtonText };
    }
    case 'signIn': {
      const { setNavigableRoute, isPending } =
        props as UseAuthenticatorProps<'signIn'>;

      const {
        headingText,
        linkResetPasswordText,
        linkSignUpText,
        submitButtonText,
      } = displayText.signIn;

      const buttons: LinkButtonsProps['buttons'] = [
        {
          children: linkResetPasswordText,
          key: 'resetPassword',
          onClick: () => setNavigableRoute('resetPassword'),
        },
        {
          children: linkSignUpText,
          key: 'signUp',
          onClick: () => setNavigableRoute('signUp'),
        },
      ];

      return { buttons, headingText, isPending, submitButtonText };
    }
    case 'signUp': {
      const { setNavigableRoute, isPending } =
        props as UseAuthenticatorProps<'signUp'>;

      const { headingText, linkSignInText, submitButtonText } =
        displayText.signUp;

      const buttons = [
        {
          children: linkSignInText,
          key: 'signIn',
          onClick: () => setNavigableRoute('signIn'),
        },
      ];

      return { buttons, headingText, isPending, submitButtonText };
    }
    default: {
      return null;
    }
  }
}

// `AuthenticatorInternal` exists to give access to the context returned via `useAuthenticator`,
// which allows the `Authenticator` to just return `children` if a user is authenticated.
// Once the `Provider` is removed from the `Authenticator` component and exported as
// `AuthenticatorProvider`, this component should be renamed to `Authenticator`.
export function AuthenticatorInternal({
  children,
  displayText: overrideDisplayText,
  ErrorView = DefaultErrorView,
  Form = DefaultForm,
  formFields,
  // hideSignUp,
  initialState,
  loginMechanisms,
  signUpAttributes,
  services,
  socialProviders,
  SubmitButton = DefaultSubmitButton,
  variation,
}: AuthenticatorProps): JSX.Element | null {
  // @todo rename error to submitError (or similar)?
  const { error, route, signOut, submitForm, user } = useAuthenticator(
    ({ error, route, signOut, user }) => [error, route, signOut, user]
  );
  useAuthenticatorInitMachine({
    initialState,
    // @todo how to surface this back to the UI for passing to getDefaultFields
    loginMechanisms,
    services,
    signUpAttributes,
    socialProviders,
    formFields,
  });

  const props = useAuthenticatorProps({ route });

  const displayText = React.useMemo(
    () => ({ ...overrideDisplayText, ...defaultDisplayText }),
    [overrideDisplayText]
  );

  const fields = React.useMemo(
    () => getDefaultFields({ route, loginMechanism: loginMechanisms?.[0] }),
    [route, loginMechanisms]
  );

  const uiProps = React.useMemo(
    () => getProps({ displayText, props, route }),
    [displayText, props, route]
  );

  const formRef = React.useRef<React.ElementRef<typeof DefaultForm>>(null);

  // @todo clear `Form` on initial mount or unmount
  // @todo prevemt reset on submit events
  React.useEffect(() => {
    // return () => {
    // formRef.current?.reset();
    // };
  });

  // const Override = components?.[route];
  // if (Override) {
  //   return <Override {...props} />;
  // }

  const isAuthenticatedRoute = route === 'authenticated' || route === 'signOut';

  if (isAuthenticatedRoute) {
    if (!children) {
      return null;
    }

    return (
      <>
        {isFunction(children)
          ? // @todo remove render props
            children({ signOut, user }) // children is a render prop
          : children}
      </>
    );
  }

  if (!uiProps) {
    return null;
  }

  const { buttons, headingText, isPending, submitButtonText } = uiProps;

  return (
    <View
      data-amplify-authenticator=""
      data-variation={variation}
      style={{ justifyContent: 'center' }}
    >
      {/* <CustomHeaderProp /> */}
      <Form
        onSubmit={(data) => {
          // eslint-disable-next-line no-console
          console.log('Sbbbbbbbbmit', data);

          submitForm(data);
        }}
        ref={formRef}
      >
        <Flex data-amplify-container="" direction="column">
          <Heading level={3}>{headingText}</Heading>
          <DefaultFields fields={fields} />
          <DefaultForm.ButtonControl type="submit">
            <SubmitButton isDisabled={isPending}>
              {submitButtonText}
            </SubmitButton>
          </DefaultForm.ButtonControl>
          <LinkButtons buttons={buttons} />
          {error ? <ErrorView>{error}</ErrorView> : null}
        </Flex>
      </Form>
    </View>
  );
}

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
export function Authenticator(props: AuthenticatorProps): JSX.Element {
  React.useEffect(() => {
    configureComponent({
      packageName: '@aws-amplify/ui-react',
      version: VERSION,
    });
  }, []);

  return (
    <Provider>
      <AuthenticatorInternal {...props} />
    </Provider>
  );
}

Authenticator.Provider = Provider;
Authenticator.Form = DefaultForm;
Authenticator.ErrorView = DefaultErrorView;
Authenticator.SubmitButton = DefaultSubmitButton;

// @todo maybe QRCodeView?
// Authenticator.SetupTotp= ...;
// Authenticator.Container = ...;

// should these take children?
// Authenticator.SocialProviders = ...;
// Authenticator.Field = ...;
