import * as React from 'react';
import classNames from 'classnames';

import { ComponentClassNames } from '../shared/constants';
import { FlexProps, PrimitiveWithForwardRef } from '../types';
import { View } from '../View';

const FlexInner: PrimitiveWithForwardRef<FlexProps, 'div'> = (
  { className, children, ...rest },
  ref
) => (
  <View
    className={classNames(ComponentClassNames.Flex, className)}
    ref={ref}
    {...rest}
  >
    {children}
  </View>
);

export const Flex = React.forwardRef(FlexInner);

Flex.displayName = 'Flex';
