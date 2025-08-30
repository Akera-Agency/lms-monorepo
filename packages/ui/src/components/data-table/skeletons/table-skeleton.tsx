import { TableCell, TableRow } from '../../shadcn/table';
import useUniqueId from '../../../hooks/use-unique-id';
import { Skeleton } from '../../skeleton/skeleton';

type TTableRowSkeletonProps = {
  columnCount?: number;
};

const TableRowSkeleton = ({ columnCount = 10 }: TTableRowSkeletonProps) => {
  const uniqueIds = useUniqueId(columnCount - 2);

  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="foreground" className="h-5 w-5 rounded-md" />
      </TableCell>
      {uniqueIds.map((id) => (
        <TableCell key={id}>
          <Skeleton
            variant="foreground"
            className="h-8 w-full max-w-32 rounded-md"
          />
        </TableCell>
      ))}
      <TableCell>
        <div className="flex items-center justify-start gap-1">
          <Skeleton variant="foreground" className="h-2 w-2 rounded-full" />
          <Skeleton variant="foreground" className="h-2 w-2 rounded-full" />
          <Skeleton variant="foreground" className="h-2 w-2 rounded-full" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableRowSkeleton;
