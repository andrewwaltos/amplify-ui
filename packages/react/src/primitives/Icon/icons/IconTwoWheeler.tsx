import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';
import { useDeprecationWarning } from '../../../hooks/useDeprecationWarning';

/**
 * @deprecated These icons are being removed in the next major release. You can use the [react-icons](https://react-icons.github.io/react-icons) package or other React icon libraries in its place. `import { IconTwoWheeler } from '@aws-amplify/ui-react';` → `import { MdTwoWheeler } from 'react-icons/md';`
 */
export const IconTwoWheeler = (props) => {
  const { className, ...rest } = props;
  useDeprecationWarning({
    shouldWarn: true,
    message: `Built-in icons are being deprecated in the next major release. You can use the react-icons (https://react-icons.github.io/react-icons) package with the Material Icon set in place of these icons or any other React Icon library.
import { IconTwoWheeler } from '@aws-amplify/ui-react'; → import { MdTwoWheeler } from 'react-icons/md';`,
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
          d="M4.17 11C4.12 11 4.06 11 4 11H4.17ZM13.41 5H9V7H12.59L14.59 9H11L7 11L5 9H0V11H4C1.79 11 0 12.79 0 15C0 17.21 1.79 19 4 19C6.21 19 8 17.21 8 15L10 17H13L16.49 10.9L17.5 11.91C16.59 12.64 16 13.75 16 15C16 17.21 17.79 19 20 19C22.21 19 24 17.21 24 15C24 12.79 22.21 11 20 11C19.82 11 19.64 11.03 19.47 11.05L17.41 9H20V6L16.28 7.86L13.41 5ZM20 17C18.9 17 18 16.1 18 15C18 13.9 18.9 13 20 13C21.1 13 22 13.9 22 15C22 16.1 21.1 17 20 17ZM4 17C2.9 17 2 16.1 2 15C2 13.9 2.9 13 4 13C5.1 13 6 13.9 6 15C6 16.1 5.1 17 4 17Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
