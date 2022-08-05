/* DO NOT EDIT DIRECTLY */
/* This file is autogenerated by "docs/scripts/generate-props-tables.ts" script. */
export const propsData = {
  displayName: 'Link',
  mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
  htmlElement: 'a',
  propsLists: [
    {
      name: 'Link',
      props: [
        {
          name: 'children',
          isOptional: false,
          type: 'React.ReactNode',
          description: 'Children to be rendered inside the Link component',
        },
        {
          name: 'className',
          isOptional: true,
          type: 'string',
          description: 'Additional CSS class name for component',
        },
        {
          name: 'href',
          isOptional: true,
          type: 'string',
          description:
            'a stringifier that returns a string containing the whole URL, and allows the href to be updated. See: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/href)',
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
          description:
            'Sets the Boolean &#96;disabled&#96; HTML attribute, which, when present, makes the element not mutable, focusable, or even submitted with the form',
        },
        {
          name: 'isExternal',
          isOptional: true,
          type: 'boolean',
          description:
            'Boolean value indicating an external link sets the rel attribute to \\"noopener noreferrer\\"',
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
          name: 'to',
          isOptional: true,
          type: 'string',
          description:
            "The Link component\\'s to prop will soon be deprecated. Please see the Amplify UI documentation for using the Link component with routing libraries: https://ui.docs.amplify.aws/react/components/link#routing-libraries A string representation of the URL path",
        },
      ],
      utilityProps: [
        {
          name: 'Layout',
          props: [
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
              name: 'flex',
              isOptional: true,
              type: 'ResponsiveStyle<Property.Flex<0 | (string & {})>>',
              description: 'Shorthand for flex grow / shrink / basis',
            },
            {
              name: 'grow',
              isOptional: true,
              type: 'ResponsiveStyle<Property.FlexGrow>',
              description: 'Ability for flex item to grow',
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
          ],
        },
      ],
    },
  ],
};
