import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconBurstMode = (props) => {
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
          d="M1 5H3V19H1V5ZM5 5H7V19H5V5ZM22 5H10C9.45 5 9 5.45 9 6V18C9 18.55 9.45 19 10 19H22C22.55 19 23 18.55 23 18V6C23 5.45 22.55 5 22 5ZM21 17H11V7H21V17ZM17.43 12.62L15.43 15.19L14 13.47L12 15.99H20L17.43 12.62Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
