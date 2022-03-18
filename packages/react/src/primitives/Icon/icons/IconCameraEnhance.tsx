import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';
import { useDeprecationWarning } from '../../../hooks/useDeprecationWarning';

/**
 * @deprecated These icons are being removed in the next major release. You can use the [react-icons](https://react-icons.github.io/react-icons) package or other React icon libraries in its place. `import { IconCameraEnhance } from '@aws-amplify/ui-react';` → `import { MdCameraEnhance } from 'react-icons/md';`
 */
export const IconCameraEnhance = (props) => {
  const { className, ...rest } = props;
  useDeprecationWarning({
    shouldWarn: true,
    message: `Built-in icons are being deprecated in the next major release. You can use the react-icons (https://react-icons.github.io/react-icons) package with the Material Icon set in place of these icons or any other React Icon library.
import { IconCameraEnhance } from '@aws-amplify/ui-react'; → import { MdCameraEnhance } from 'react-icons/md';`,
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
          d="M12 10L11.06 12.06L9 13L11.06 13.94L12 16L12.94 13.94L15 13L12.94 12.06L12 10ZM20 5H16.83L15 3H9L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM20 19H4V7H8.05L8.64 6.35L9.88 5H14.12L15.36 6.35L15.95 7H20V19ZM12 8C9.24 8 7 10.24 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10.24 14.76 8 12 8ZM12 16C10.35 16 9 14.65 9 13C9 11.35 10.35 10 12 10C13.65 10 15 11.35 15 13C15 14.65 13.65 16 12 16Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
