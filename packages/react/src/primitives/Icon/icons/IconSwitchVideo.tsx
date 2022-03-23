import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';
import { useDeprecationWarning } from '../../../hooks/useDeprecationWarning';

/**
 * @deprecated These icons are being removed in the next major release. You can use the [react-icons](https://react-icons.github.io/react-icons) package or other React icon libraries in its place. `import { IconSwitchVideo } from '@aws-amplify/ui-react';` → `import { MdSwitchVideo } from 'react-icons/md';`
 */
export const IconSwitchVideo = (props) => {
  const { className, ...rest } = props;
  useDeprecationWarning({
    shouldWarn: true,
    message: `Built-in icons are being deprecated in the next major release. You can use the react-icons (https://react-icons.github.io/react-icons) package with the Material Icon set in place of these icons or any other React Icon library.
import { IconSwitchVideo } from '@aws-amplify/ui-react'; → import { MdSwitchVideo } from 'react-icons/md';`,
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
          d="M8 13H12V15L15 12L12 9V11H8V9L5 12L8 15V13ZM18 9.5V6C18 5.45 17.55 5 17 5H3C2.45 5 2 5.45 2 6V18C2 18.55 2.45 19 3 19H17C17.55 19 18 18.55 18 18V14.5L22 18.5V5.5L18 9.5ZM16 17H4V7H16V17Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
