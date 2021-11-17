import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const Icon6FtApart = (props) => {
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
          d="M6 6C7.1 6 8 5.1 8 4C8 2.9 7.1 2 6 2C4.9 2 4 2.9 4 4C4 5.1 4.9 6 6 6ZM10 9.43C10 8.62 9.52 7.9 8.78 7.58C7.93 7.21 6.99 7 6 7C5.01 7 4.07 7.21 3.22 7.58C2.48 7.9 2 8.62 2 9.43V10H10V9.43ZM18 6C19.1 6 20 5.1 20 4C20 2.9 19.1 2 18 2C16.9 2 16 2.9 16 4C16 5.1 16.9 6 18 6ZM22 9.43C22 8.62 21.52 7.9 20.78 7.58C19.93 7.21 18.99 7 18 7C17.01 7 16.07 7.21 15.22 7.58C14.48 7.9 14 8.62 14 9.43V10H22V9.43ZM19 17V14.99L5 15V17L2 14L5 11V13.01L19 13V11L22 14L19 17ZM10 19V18H7.5C7.22 18 7 18.22 7 18.5V21.5C7 21.78 7.22 22 7.5 22H9.5C9.78 22 10 21.78 10 21.5V20C10 19.72 9.78 19.5 9.5 19.5H8V19H10ZM9 20.5V21H8V20.5H9ZM17.5 19H16.5V22H15.5V19H14.5V18H17.5V19ZM12.5 19V19.5H13.5V20.5H12.5V22H11.5V18H14V19H12.5Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
