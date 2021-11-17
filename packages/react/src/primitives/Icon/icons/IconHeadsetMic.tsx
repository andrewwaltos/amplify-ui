import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconHeadsetMic = (props) => {
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
          d="M19 14V18H17V14H19ZM7 14V18H6C5.45 18 5 17.55 5 17V14H7ZM12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H19V21H12V23H18C19.66 23 21 21.66 21 20V10C21 5.03 16.97 1 12 1Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
