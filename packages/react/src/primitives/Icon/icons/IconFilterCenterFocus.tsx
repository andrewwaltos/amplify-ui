import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconFilterCenterFocus = (props) => {
  const { className, ...rest } = props;
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
          d="M5 15H3V19C3 20.1 3.9 21 5 21H9V19H5V15ZM5 5H9V3H5C3.9 3 3 3.9 3 5V9H5V5ZM19 3H15V5H19V9H21V5C21 3.9 20.1 3 19 3ZM19 19H15V21H19C20.1 21 21 20.1 21 19V15H19V19ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
