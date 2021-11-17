import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';

export const IconGTranslate = (props) => {
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
          d="M20 5H10.88L10 2H4C2.9 2 2 2.9 2 4V17C2 18.1 2.9 19 4 19H11L12 22H20C21.1 22 22 21.1 22 20V7C22 5.9 21.1 5 20 5ZM7.17 14.59C4.92 14.59 3.08 12.76 3.08 10.5C3.08 8.24 4.91 6.41 7.17 6.41C8.21 6.41 9.16 6.78 9.91 7.48L9.98 7.54L8.75 8.72L8.69 8.67C8.4 8.4 7.91 8.08 7.17 8.08C5.86 8.08 4.79 9.17 4.79 10.5C4.79 11.83 5.86 12.92 7.17 12.92C8.54 12.92 9.13 12.05 9.29 11.46H7.08V9.91H11.03L11.04 9.98C11.08 10.19 11.09 10.38 11.09 10.59C11.09 12.94 9.48 14.59 7.17 14.59V14.59ZM13.2 12.88C13.53 13.48 13.94 14.06 14.39 14.58L13.85 15.11L13.2 12.88V12.88ZM13.97 12.12H12.98L12.67 11.08H16.66C16.66 11.08 16.32 12.39 15.1 13.82C14.58 13.2 14.21 12.59 13.97 12.12V12.12ZM21 20C21 20.55 20.55 21 20 21H13L15 19L14.19 16.23L15.11 15.31L17.79 18L18.52 17.27L15.81 14.59C16.71 13.56 17.41 12.34 17.73 11.08H19V10.04H15.36V9H14.32V10.04H12.36L11.18 6H20C20.55 6 21 6.45 21 7V20Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};
