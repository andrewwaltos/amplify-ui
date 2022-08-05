/* DO NOT EDIT DIRECTLY */
/* This file is autogenerated by "docs/scripts/generate-props-tables.ts" script. */
export const propsData = {
  displayName: 'Button',
  mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
  htmlElement: 'button',
  propsLists: [
    {
      name: 'Button',
      props: [
        {
          name: 'autoFocus',
          isOptional: true,
          type: 'boolean',
          description: '',
        },
        {
          name: 'className',
          isOptional: true,
          type: 'string',
          description: 'Additional CSS class name for component',
        },
        {
          name: 'disabled',
          isOptional: true,
          type: 'boolean',
          description: '',
        },
        {
          name: 'form',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'formAction',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'formEncType',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'formMethod',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'formNoValidate',
          isOptional: true,
          type: 'boolean',
          description: '',
        },
        {
          name: 'formTarget',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'id',
          isOptional: true,
          type: 'string',
          description: 'Unique identifier',
        },
        {
          name: 'isDisabled',
          isOptional: true,
          type: 'boolean',
          description: 'If &#96;true&#96;, the button will be disabled.',
        },
        {
          name: 'isFullWidth',
          isOptional: true,
          type: 'boolean',
          description:
            'If &#96;true&#96;, the button will take up the full width of its container.',
        },
        {
          name: 'isLoading',
          isOptional: true,
          type: 'boolean',
          description: 'If &#96;true&#96;, the button will show a spinner.',
        },
        {
          name: 'loadingText',
          isOptional: true,
          type: 'string',
          description:
            'The label to show in the button when &#96;loading&#96; is true If no text is passed, it only shows the spinner',
        },
        {
          name: 'name',
          isOptional: true,
          type: 'string',
          description: '',
        },
        {
          name: 'onClick',
          isOptional: true,
          type: 'React.MouseEventHandler<HTMLButtonElement>',
          description: 'Button click event handler',
        },
        {
          name: 'size',
          isOptional: true,
          type: "\\'small\\' | \\'large\\'",
          description: 'Changes the size of the button. Default: \\"medium\\"',
        },
        {
          name: 'style',
          isOptional: true,
          type: 'React.CSSProperties',
          description:
            'Accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes. See: [React docs](https://reactjs.org/docs/dom-elements.html#style)',
        },
        {
          name: 'testId',
          isOptional: true,
          type: 'string',
          description:
            'Used to provide a &#96;data-testid&#96; attribute for testing purposes',
        },
        {
          name: 'type',
          isOptional: true,
          type: "\\'button\\' | \\'reset\\' | \\'submit\\'",
          description: 'Changes the button type Default: \\"button\\"',
        },
        {
          name: 'value',
          isOptional: true,
          type: 'string | number | readonly string[]',
          description: '',
        },
        {
          name: 'variation',
          isOptional: true,
          type: "\\'primary\\' | \\'link\\' | \\'menu\\'",
          description: 'Changes the visual weight of the button.',
        },
      ],
      utilityProps: [
        {
          name: 'Layout',
          props: [
            {
              name: 'alignContent',
              isOptional: true,
              type: 'ResponsiveStyle<Property.AlignContent>',
              description:
                "Sets the distribution of space between and around content items along a flexbox\\'s cross-axis or a grid\\'s block axis. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)",
            },
            {
              name: 'alignItems',
              isOptional: true,
              type: 'ResponsiveStyle<Property.AlignItems>',
              description:
                'Sets the align-self value on all direct children as a group. In Flexbox, it controls the alignment of items on the Cross Axis. In Grid Layout, it controls the alignment of items on the Block Axis within their grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)',
            },
            {
              name: 'area',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridArea>',
              description:
                "Specifies a grid item\\'s size and location within a grid by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the edges of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)",
            },
            {
              name: 'basis',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexBasis<0 | (string & {})>>',
              description:
                'Default size of element before remaining space is distributed',
            },
            {
              name: 'column',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridColumn>',
              description:
                "Specifies a grid item\\'s size and location within a grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)",
            },
            {
              name: 'columnEnd',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridColumnEnd>',
              description:
                "Specifies a grid item\\'s end position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the block-end edge of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end)",
            },
            {
              name: 'columnGap',
              isOptional: true,
              type: 'ResponsiveStyle<SpaceKeys<StyleToken<Property.GridColumnGap<0 | (string & {})>>>>',
              description:
                'Controls the spacing between Flex/Grid child columns See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)',
            },
            {
              name: 'columnSpan',
              isOptional: true,
              type: 'ResponsiveStyle<GridSpanType>',
              description:
                'Makes it possible for an element to span across all columns when its value is set to all. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/column-span)',
            },
            {
              name: 'columnStart',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridColumnStart>',
              description:
                "Specifies a grid item\\'s start position within the grid column by contributing a line, a span, or nothing (automatic) to its grid placement. This start position defines the block-start edge of the grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start)",
            },
            {
              name: 'direction',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexDirection>',
              description:
                'Sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed). (maps to flex-direction CSS property)',
            },
            {
              name: 'flex',
              isOptional: true,
              type: 'ResponsiveStyle<Property.Flex<0 | (string & {})>>',
              description: 'Shorthand for flex grow / shrink / basis',
            },
            {
              name: 'gap',
              isOptional: true,
              type: 'ResponsiveStyle<SpaceKeys<StyleToken<Property.Gap<0 | (string & {})>>>>',
              description:
                'Controls the spacing between child components. Shorthand for rowGap and columnGap. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)',
            },
            {
              name: 'grow',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexGrow>',
              description: 'Ability for flex item to grow',
            },
            {
              name: 'justifyContent',
              isOptional: true,
              type: 'ResponsiveStyle<Property.JustifyContent>',
              description:
                'Defines how the browser distributes space between and around content items along the main-axis of a flex container, and the inline axis of a grid container. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)',
            },
            {
              name: 'order',
              isOptional: true,
              type: 'ResponsiveStyle<Property.Order>',
              description:
                'Sets the order to lay out an item in a flex or grid container.',
            },
            {
              name: 'row',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridRow>',
              description:
                "Specifies a grid item\\'s size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)",
            },
            {
              name: 'rowEnd',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridRowEnd>',
              description:
                "Specifies a grid item\\'s end position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-end edge of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end)",
            },
            {
              name: 'rowGap',
              isOptional: true,
              type: 'ResponsiveStyle<SpaceKeys<StyleToken<Property.RowGap<0 | (string & {})>>>>',
              description:
                'Controls the spacing between Flex/Grid child rows See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)',
            },
            {
              name: 'rowSpan',
              isOptional: true,
              type: 'ResponsiveStyle<GridSpanType>',
              description: '',
            },
            {
              name: 'rowStart',
              isOptional: true,
              type: 'ResponsiveStyle<Property.GridRowStart>',
              description:
                "Specifies a grid item\\'s start position within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start edge of its grid area. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start)",
            },
            {
              name: 'shrink',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexShrink>',
              description: 'Ability for flex item to shrink',
            },
            {
              name: 'wrap',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexWrap>',
              description:
                'The flexWrap property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed. (maps to flex-wrap CSS property)',
            },
          ],
        },
      ],
    },
  ],
};
