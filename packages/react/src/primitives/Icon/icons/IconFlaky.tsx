import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconFlaky = (props) => {
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.05 17.58L14.04 17.59L11.64 15.19L12.7 14.13L14.05 15.48L16.54 13L17.6 14.06L14.06 17.6L14.05 17.58ZM12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM7.34 6.28L8.75 7.69L10.16 6.28L11.22 7.34L9.81 8.75L11.22 10.16L10.16 11.22L8.75 9.81L7.34 11.22L6.28 10.16L7.69 8.75L6.28 7.34L7.34 6.28ZM12 20C9.8 20 7.8 19.1 6.3 17.7L17.7 6.3C19.1 7.8 20 9.8 20 12C20 16.4 16.4 20 12 20Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
