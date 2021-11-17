import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconCropFree = (props) => {
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
          d="M3 5V9H5V5H9V3H5C3.9 3 3 3.9 3 5ZM5 15H3V19C3 20.1 3.9 21 5 21H9V19H5V15ZM19 19H15V21H19C20.1 21 21 20.1 21 19V15H19V19ZM19 3H15V5H19V9H21V5C21 3.9 20.1 3 19 3Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
