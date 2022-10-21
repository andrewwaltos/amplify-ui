import {
  Badge,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  View,
} from '@aws-amplify/ui-react';
import {
  ResponsiveTable,
  ResponsiveTableCell,
} from '@/components/ResponsiveTable';
import { CodeHighlight } from '@/components/CodeHighlight';

export type Prop = {
  name: string;
  isOptional: boolean;
  type: string;
  description: string;
};

interface PropTableProps {
  props: Prop[];
}

export const PropsTable = ({ props }: PropTableProps) => {
  return (
    <ResponsiveTable className="docs-prop-table">
      <TableHead>
        <TableRow>
          <TableCell as="th">Name</TableCell>
          <TableCell as="th">Type</TableCell>
          <TableCell as="th">Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.map((prop, index) => {
          const { name, isOptional, type, description } = prop;
          return (
            <TableRow key={`${prop}-${index}`}>
              <ResponsiveTableCell label="Name">{name}</ResponsiveTableCell>
              <ResponsiveTableCell label="Type">
                <CodeHighlight code={type} language="typescript" />
              </ResponsiveTableCell>
              <ResponsiveTableCell label="Description">
                {!isOptional && (
                  <View marginBlockEnd="xs">
                    <Badge variation="info" size="small">
                      required
                    </Badge>
                  </View>
                )}
                {description}
              </ResponsiveTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </ResponsiveTable>
  );
};