import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconOpenWith = (props) => {
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
          d="M10 9H14V6H17L12 1L7 6H10V9ZM9 10H6V7L1 12L6 17V14H9V10ZM23 12L18 7V10H15V14H18V17L23 12ZM14 15H10V18H7L12 23L17 18H14V15Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
