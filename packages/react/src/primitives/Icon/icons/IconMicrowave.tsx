import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconMicrowave = (props) => {
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
          d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM4 6H14V18H4V6ZM20 18H16V6H20V18ZM19 9H17V7H19V9ZM18 13C17.45 13 17 12.55 17 12C17 11.45 17.45 11 18 11C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13ZM18 17C17.45 17 17 16.55 17 16C17 15.45 17.45 15 18 15C18.55 15 19 15.45 19 16C19 16.55 18.55 17 18 17ZM10.25 16C9.46 16 8.88 15.62 8.46 15.34C8.13 15.12 7.94 15 7.75 15C7.38 15 6.95 15.41 6.8 15.61L5.38 14.19C5.73 13.79 6.59 13 7.75 13C8.55 13 9.14 13.39 9.56 13.67C9.87 13.88 10.07 14 10.25 14C10.62 14 11.05 13.59 11.2 13.39L12.62 14.81C12.26 15.21 11.41 16 10.25 16ZM10.25 11C9.46 11 8.88 10.62 8.46 10.34C8.13 10.12 7.94 10 7.75 10C7.38 10 6.95 10.41 6.8 10.61L5.37 9.19C5.73 8.79 6.59 8 7.75 8C8.55 8 9.14 8.39 9.56 8.67C9.87 8.88 10.07 9 10.25 9C10.62 9 11.05 8.59 11.2 8.39L12.62 9.81C12.26 10.21 11.41 11 10.25 11Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
