import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';
import { useDeprecationWarning } from '../../../hooks/useDeprecationWarning';

/**
 * @deprecated These icons are being removed in the next major release. You can use the [react-icons](https://react-icons.github.io/react-icons) package or other React icon libraries in its place. `import { IconAttachMoney } from '@aws-amplify/ui-react';` → `import { MdAttachMoney } from 'react-icons/md';`
 */
export const IconAttachMoney = (props) => {
  const { className, ...rest } = props;
  useDeprecationWarning({
    shouldWarn: true,
    message: `Built-in icons are being deprecated in the next major release. You can use the react-icons (https://react-icons.github.io/react-icons) package with the Material Icon set in place of these icons or any other React Icon library.
import { IconAttachMoney } from '@aws-amplify/ui-react'; → import { MdAttachMoney } from 'react-icons/md';`,
  });
  return (
    <View
      as="span"
      width="1em"
      height="1em"
      className={classNames(ComponentClassNames.Icon, className)}
      {...rest}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8001 10.9C9.53007 10.31 8.80007 9.7 8.80007 8.75C8.80007 7.66 9.81007 6.9 11.5001 6.9C13.2801 6.9 13.9401 7.75 14.0001 9H16.2101C16.1401 7.28 15.0901 5.7 13.0001 5.19V3H10.0001V5.16C8.06007 5.58 6.50007 6.84 6.50007 8.77C6.50007 11.08 8.41007 12.23 11.2001 12.9C13.7001 13.5 14.2001 14.38 14.2001 15.31C14.2001 16 13.7101 17.1 11.5001 17.1C9.44007 17.1 8.63007 16.18 8.52007 15H6.32007C6.44007 17.19 8.08007 18.42 10.0001 18.83V21H13.0001V18.85C14.9501 18.48 16.5001 17.35 16.5001 15.3C16.5001 12.46 14.0701 11.49 11.8001 10.9Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
