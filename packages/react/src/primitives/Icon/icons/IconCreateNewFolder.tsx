import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconCreateNewFolder = (props) => {
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
          d="M20 6H12L10 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V8C22 6.89 21.11 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM12 14H14V16H16V14H18V12H16V10H14V12H12V14Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
