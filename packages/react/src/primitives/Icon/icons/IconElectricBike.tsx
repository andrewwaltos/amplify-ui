import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconElectricBike = (props) => {
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
          d="M19 7H18.18L16.48 2.32C16.19 1.53 15.44 1 14.6 1H12V3H14.6L16.06 7H11.25L10.89 6H12V4H7V6H8.75L10.57 11H9.9C9.46 8.77 7.59 7.12 5.25 7.01C2.45 6.87 0 9.2 0 12C0 14.8 2.2 17 5 17C7.46 17 9.45 15.31 9.9 13H14.1C14.54 15.23 16.41 16.88 18.75 16.99C21.55 17.12 24 14.8 24 11.99C24 9.2 21.8 7 19 7ZM7.82 13C7.42 14.17 6.33 15 5 15C3.32 15 2 13.68 2 12C2 10.32 3.32 9 5 9C6.33 9 7.42 9.83 7.82 11H5V13H7.82ZM14.1 11H12.7L11.97 9H15C14.56 9.58 14.24 10.25 14.1 11ZM19 15C17.32 15 16 13.68 16 12C16 11.07 16.41 10.27 17.05 9.72L18.01 12.36L19.89 11.68L18.92 9.01C18.94 9.01 18.97 9 19 9C20.68 9 22 10.32 22 12C22 13.68 20.68 15 19 15Z"
          fill="currentColor"
        />
        <path d="M11 20H7L13 23V21H17L11 18V20Z" fill="black" />
      </svg>
    </View>
  );
};
