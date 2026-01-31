import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerRowClassName,
  headerCellClassName,
  headerClassName,
  bodyRowClassName,
  bodyCellClassName,
}: DataTableProps<T>) => {
  return (
    <div className="relative w-full overflow-x-auto custom-scrollbar">
      <Table
        className={cn(
          "min-w-full border-separate border-spacing-y-1",
          tableClassName
        )}
      >
        <TableHeader className={headerClassName}>
          <TableRow
            className={cn(
              "hover:bg-transparent border-none",
              headerRowClassName
            )}
          >
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  "bg-dark-400 text-purple-100 text-sm font-semibold py-3 px-4 first:rounded-l-md last:rounded-r-md",
                  headerCellClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowKey(row, rowIndex)}
              className={cn(
                "bg-dark-500/40 hover:bg-dark-500 transition-colors rounded-md",
                bodyRowClassName
              )}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn(
                    "py-3 px-4 align-middle text-sm first:rounded-l-md last:rounded-r-md",
                    bodyCellClassName
                  )}
                >
                  {column.cell(row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
